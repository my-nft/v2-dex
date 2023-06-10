import { Link } from "react-router-dom";

import { BiLinkExternal } from "react-icons/bi";
import { IoReload } from "react-icons/io5";
import { RiSettingsLine } from "react-icons/ri";
import { useCallback, useEffect, useState } from "react";
import SettingsPopup from "../../components/popups/settings";
import TokenSelect from "../../components/popups/tokenSelect";
import PageTitle from "../../components/pageTitle/pageTitle";
import { ColorRing } from "react-loader-spinner";
import { UsedCoins } from "../../data";
import { useAccount, useNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import {
  getLiquidityEquivalent,
  getTokensLiquidity,
  shouldApprove,
} from "../../web3/web3Interactor";
import { useDispatch } from "react-redux";
import { ADD_LIQUIDITY, REMOVE_LIQUIDITY, APPROVE_LIQUIDITY, APPROVE_REMOVE_LIQUIDITY } from "../../saga/actions";
import TokenSelectInput from "../../components/tokenSelect/tokenSelect";
import { useDebouncedCallback } from "use-debounce";

const LiquidityPage = () => {
  const [showPopup, setShowPopup] = useState(null);
  const [selectTarget, setSelectTarget] = useState(null);
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const [liquidity, setLiquidity] = useState(0);
  const [liquidityEquivalent, setLiquidityEquivalent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [approvedLiquidity, setApprovedLiquidity] = useState(false);
  const [approvedRemoveLiquidity, setApprovedRemoveLiquidity] = useState(false);
  const [liquidityTokens, setLiquidityTokens] = useState(null);

  const dispatch = useDispatch();
  const { chain } = useNetwork();

  const runApproveLiquidity = async () => {
    setLoading(true);
    dispatch({
      type: APPROVE_LIQUIDITY,
      setLoading: setLoading,
      approveChange: setApprovedLiquidity,

      payload: {
        from: fromToken,
        to: toToken,
        valueFrom: liquidity,
        valueTo: liquidityEquivalent,
      },
    });
  };

  const runApproveRemoveLiquidity = async () => {
    // setLoading(true);
    console.log("runApproveRemoveLiquidity = async ");
    dispatch({
      type: APPROVE_REMOVE_LIQUIDITY,
      // setLoading: setLoading,
      approveChange: setApprovedRemoveLiquidity,

      payload: {
        from: fromToken,
        to: toToken,
        // valueFrom: liquidity,
        // valueTo: liquidityEquivalent,
      },
    });
  };

  const runAddLiquidity = () => {
    dispatch({
      type: ADD_LIQUIDITY,
      setLoading: setLoading,
      onSuccess: resetForm,
      payload: {
        from: fromToken,
        valueFrom: liquidity,
        to: toToken,
        valueTo: liquidityEquivalent,
      },
    });
  };

  const runRemoveLiquidity = () => {
    console.log("removing liquidity")
    dispatch({
      type: REMOVE_LIQUIDITY,
      setLoading: setLoading,
      onSuccess: resetForm,
      payload: {
        from: fromToken,
        to: toToken,
      },
    });
  };

  const resetForm = () => {
    setLiquidity(0);
    setLiquidityEquivalent(0);
    setFromToken(null);
    setToToken(null);
  };

  const computeLiquidityTarget = (value) => {
    if (value < 0) value = 0;
    if (isNaN(value)) value = 0;

    setLiquidity(value);
    if (!fromToken || !toToken) return;
    debouncedConvertTarget(Number(value));
  };

  const computeLiquidityOrigin = (value) => {
    if (value < 0) value = 0;
    if (isNaN(value)) value = 0;
    setLiquidityEquivalent(value);
    if (!fromToken || !toToken) return;
    debounceConvertOrigin(Number(value));
  };

  const callConvertTarget = async (value) => {
    const amount = await getLiquidityEquivalent(
      Number(value),
      fromToken?.smartContractAddress,
      toToken?.smartContractAddress
    );

    console.log("callConvertTarget");

    if (amount !== undefined) {
      setLiquidityEquivalent(amount);
    } else {
      // setLiquidityEquivalent(0);
    }
  };

  const callConvertOrigin = async (value) => {
    const amount = await getLiquidityEquivalent(
      Number(value),
      toToken?.smartContractAddress,
      fromToken?.smartContractAddress
    );

    console.log("callConvertOrigin");

    if (amount !== undefined) {
      setLiquidity(amount);
    } else {
      // setLiquidity(0);
    }
  };

  const debouncedConvertTarget = useDebouncedCallback(async (value) => {
    if (fromToken && toToken && liquidity) {
      await callConvertTarget(value);
    }
  }, 550);

  const debounceConvertOrigin = useDebouncedCallback(async (value) => {
    if (fromToken && toToken && liquidityEquivalent) {
      await callConvertOrigin(value);
    }
  }, 550);

  useEffect(() => {
    if (fromToken && toToken) {
      debouncedConvertTarget(liquidity);
      loadTokens();
    }
  }, [fromToken, toToken]);

  const loadTokens = async () => {
    const tks = await getTokensLiquidity(
      fromToken?.smartContractAddress,
      toToken?.smartContractAddress
    );
    console.log("==>", tks);
    setLiquidityTokens(tks);
  };

  useEffect(() => {
    if (
      isConnected &&
      fromToken &&
      toToken &&
      liquidity &&
      liquidityEquivalent
    ) {
      shouldApprove(
        fromToken?.smartContractAddress,
        toToken?.smartContractAddress,
        liquidity,
        liquidityEquivalent
      ).then((res) => {
        console.log("show approve", res);
        setShowApprove(res);
      });
    }
  }, [liquidity, fromToken, toToken, liquidityEquivalent, isConnected]);

  const getLabelButton = useCallback(() => {
    if (!isConnected) {
      return "Connect Wallet";
    } else if (showApprove && !approvedLiquidity) {
      return "Approve";
    } else {
      return "Add liquidity";
    }
  }, [showApprove, approvedLiquidity, isConnected]);

  const runAction = async () => {
    if (!isConnected) {
      await open();
    } else if (showApprove && !approvedLiquidity) {
      runApproveLiquidity();
    } else {
      runAddLiquidity();
    }
  };

  const runRemoveLiquidityAction = async () => {
    if (!isConnected) {
      await open();
    } else if (!approvedRemoveLiquidity) {
      runApproveRemoveLiquidity();
    } else {
      runRemoveLiquidity();
    }
  };

  return (
    <div className="max-w-container mx-auto w-4/5 mb-24">
      <SettingsPopup
        shouldShow={showPopup === "settings"}
        closePopup={() => setShowPopup(null)}
      />
      <TokenSelect
        shouldShow={showPopup === "select"}
        closePopup={() => setShowPopup(null)}
        setFromToken={setFromToken}
        setToToken={setToToken}
        selectTarget={selectTarget}
        options={UsedCoins}
        ignoreToken={selectTarget === "from" ? toToken : fromToken}
        chain={chain}
      />
      <div>
        <PageTitle
          title="Liquidity"
          subTitle={
            "Become a Liquidity Provider and earn your share of trading fees."
          }
        />
        <div className="grid 2xl:grid-cols-5 grid-cols-1 gap-8 mt-8">
          <div className="lg:col-span-2 rounded-xl bg-gradientBlue shadow-box ">
            <div className="bg-gradientContainer p-6 rounded-xl h-max m-px">
              <div className="pb-2 border-b border-white flex items-center justify-between">
                <p className="font-syneBold text-2xl text-white">
                  Add Liquidity
                </p>
                <div className="flex gap-2">
                  <IoReload className="inline-block mr-2 w-5 h-5 text-text transition-all duration-200 ease-in-out -rotate-45 hover:-rotate-[30deg] cursor-pointer" />
                  <RiSettingsLine
                    className="inline-block w-5 h-5 text-text transition-all duration-200 ease-in-out hover:scale-110 cursor-pointer"
                    onClick={() => setShowPopup("settings")}
                  />
                </div>
              </div>
              <div className="mt-12 ">
                <div className="flex xl:items-center xl:flex-row gap-6 justify-between  flex-col">
                  <TokenSelectInput
                    tokenSelected={fromToken}
                    onTokenOpen={() => {
                      setShowPopup("select");
                      setSelectTarget("from");
                    }}
                    onTokenRemove={() => setFromToken(null)}
                  />
                  <div className="py-3 pl-6 pr-2 rounded-3xl bg-inputs flex items-center grow ">
                    <input
                      type="number"
                      placeholder="0"
                      className="bg-transparent text-white grow text-xl w-full outline-none"
                      value={liquidity}
                      onChange={(e) => computeLiquidityTarget(e.target.value)}
                    />
                    <p className="pl-2 pr-6 cursor-pointer text-xs h-max border-l-2 border-white text-white">
                      Max
                    </p>
                  </div>
                </div>
                <p className="text-center mt-2 mb-3 text-5xl text-gray-500 font-kanitExtraLight">
                  +
                </p>
                <div className="flex xl:items-center xl:flex-row gap-4 justify-between  flex-col">
                  <TokenSelectInput
                    tokenSelected={toToken}
                    label="To"
                    onTokenOpen={() => {
                      setShowPopup("select");
                      setSelectTarget("to");
                    }}
                    onTokenRemove={() => setToToken(null)}
                  />
                  <div className="py-3 pl-6 pr-2 rounded-3xl bg-inputs flex items-center grow ">
                    <input
                      type="number"
                      placeholder="0"
                      className="bg-transparent text-white w-full text-xl outline-none"
                      value={liquidityEquivalent}
                      onChange={(e) => computeLiquidityOrigin(e.target.value)}
                    />
                    <p className="pl-2 pr-6 cursor-pointer text-xs h-max border-l-2 border-white text-white">
                      Max
                    </p>
                  </div>
                </div>
                <button
                  className="disabled:cursor-not-allowed disabled:opacity-50 bg-gradientBlue rounded-3xl w-full mt-10 text-black font-syneBold cursor-pointer transition-all duration-200 ease-in-out hover:hue-rotate-[20deg] text-center py-3 text-xl  "
                  onClick={runAction}
                  disabled={loading}
                >
                  {getLabelButton()}
                </button>
                {loading && (
                  <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper mt-4 mx-auto"
                    colors={[
                      "#67dffe",
                      "#67dffe",
                      "#67dffe",
                      "#67dffe",
                      "#67dffe",
                    ]}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 h-max rounded-xl bg-gradientBlue shadow-box ">
            <div className="bg-gradientContainer p-6 rounded-xl h-max m-px">
              <div className="pb-2 border-b border-white flex items-center justify-between">
                <p className="font-syneBold text-2xl text-white">
                  Your position
                </p>
                <Link to="#" className="text-white font-kanitLight text-xs">
                  <BiLinkExternal className="inline-block mr-2 w-5 h-5" />
                  See all position
                </Link>
              </div>
              <div className="mt-2">
                <p className="font-syneBold text-2xl text-white">
                  Your LP Tokens
                </p>

                {!liquidityTokens && (
                  <p className="bg-buttons py-4 w-full mt-4 rounded-md text-center text-white font-kanitLight text-base">
                    No Data
                  </p>
                )}
                {liquidityTokens && (
                  <div className="flex items-center justify-between mt-4 sm:flex-row flex-col">
                    <div className="flex items-center sm:mb-0 mb-2 sm:justify-start justify-center">
                      <img
                        src={fromToken.image}
                        className="w-10 h-10 sm:mr-2 p-0.5 bg-coin rounded-full "
                        alt=""
                      />
                      <img
                        src={toToken.image}
                        className="w-10 h-10 rounded-full sm:-ml-4 sm:mr-4"
                        alt=""
                      />
                    </div>
                    <p className="font-kanitLight text-white text-base uppercase sm:mb-0 mb-2">
                      {fromToken?.symbol} - {toToken?.symbol}
                    </p>
                    <p className="sm:ml-auto sm:my-0 my-3 text-white text-base">
                      {liquidityTokens?.ratio0.toFixed(6)} -{" "}
                      {liquidityTokens?.ratio1?.toFixed(6)}
                    </p>
                    <p className="sm:ml-6 sm:mt-0 mt-2 sm:w-max w-full text-center py-3 px-5 rounded-md border border-white text-white transition-all ease-in-out duration-200 hover:bg-white hover:text-black cursor-pointer font-semibold" onClick={runRemoveLiquidityAction}>
                      Remove Liquidity
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityPage;
