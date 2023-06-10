import { useState, useEffect } from "react";
import { IoReload } from "react-icons/io5";
import { RiSettingsLine } from "react-icons/ri";
import { BsArrowDownUp } from "react-icons/bs";
import SettingsPopup from "../../components/popups/settings";
import TokenSelect from "../../components/popups/tokenSelect";
import { useAccount, useNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";

import { BiInfoCircle } from "react-icons/bi";

import { UsedCoins } from "../../data";
import { useDispatch } from "react-redux";
import { APPROVE_SWAP, RUN_SWAP } from "../../saga/actions";
import { ColorRing } from "react-loader-spinner";
import TokenSelectInput from "../../components/tokenSelect/tokenSelect";
import {
  getAmountOutMinFormatted,
  getAmoutEquivalent,
  getBalance,
  shouldApprove,
} from "../../web3/web3Interactor";
import { useDebouncedCallback } from "use-debounce";
import { useCallback } from "react";
import PageTitle from "../../components/pageTitle/pageTitle";

const HomePage = () => {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  const { chain } = useNetwork();

  const [showPopup, setShowPopup] = useState(null);
  const [selectTarget, setSelectTarget] = useState(null);
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromValue, setFromValue] = useState(0);
  const [toValue, setToValue] = useState(0);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [approvedSwap, setApprovedSwap] = useState(false);
  const [fromBalance, setFromBalance] = useState(0);
  const [toBalance, setToBalance] = useState(0);
  const [amount1UnitEquivalent, setAmount1UnitEquivalent] = useState();
  const [receivedAmount, setReceivedAmount] = useState();

  const updateEquivalentValues = useDebouncedCallback(async () => {
    if (!fromToken || !toToken) {
      return;
    }
    const amount = await getAmoutEquivalent(
      1,
      fromToken?.smartContractAddress,
      toToken?.smartContractAddress
    );

    setAmount1UnitEquivalent(amount);
  }, 800);

  const getMinReceivedAmount = useDebouncedCallback(async () => {
    if (!fromToken || !toToken || !fromValue) {
      return;
    }
    const receive = await getAmountOutMinFormatted(
      fromValue,
      fromToken.smartContractAddress,
      toToken.smartContractAddress
    );
    setReceivedAmount(receive);
  }, 800);

  useEffect(() => {
    getMinReceivedAmount();
  }, [fromToken, toToken, fromValue]);

  const whenFromTokenChange = async () => {
    const balance = await getBalance(fromToken);
    const fromvalue = Number(balance?.formatted);
    setFromBalance(fromvalue);
  };

  const whenToTokenChange = async () => {
    const balance = await getBalance(toToken);
    const fromvalue = Number(balance?.formatted);
    setToBalance(fromvalue);
  };

  useEffect(() => {
    if (fromToken) {
      whenFromTokenChange();
      updateEquivalentValues();
    }
  }, [fromToken]);

  useEffect(() => {
    if (toToken) {
      whenToTokenChange();
    }
  }, [toToken]);

  const handleFromToken = async (from) => {
    setFromToken(from);
  };

  const handleRemoveFromToken = async () => {
    setFromToken(null);
    setFromBalance(0);
  };

  const handleRemoveToToken = async () => {
    setToToken(null);
    setToBalance(0);
  };

  const handleToToken = async (to) => {
    setToToken(to);
    const balance = await getBalance(to);
    setToBalance(Number(balance?.formatted));
  };

  useEffect(() => {
    if (
      isConnected &&
      fromToken &&
      toToken &&
      fromValue &&
      toValue &&
      toToken?.symbol === "eth"
    ) {
      shouldApprove(
        fromToken?.smartContractAddress,
        toToken?.smartContractAddress,
        fromValue,
        toValue
      ).then((res) => {
        setApprovedSwap(!res);
        console.log("shouldApprove ", !res);
      });
    }
  }, [isConnected, fromToken, toToken, fromValue, toValue]);

  const dispatch = useDispatch();

  const resetForm = () => {
    setFromToken(null);
    setToToken(null);
    setFromValue(0);
    setToValue(0);
    setApprovedSwap(false);
  };

  const runSwapOrConnectWallet = async () => {
    console.log("runSwapOrConnectWallet");
    if (!isConnected) {
      await open();
    } else {
      if (isEthToWeth()) {
        runSwap();
      } else if (!approvedSwap && toToken?.symbol === "eth") {
        runApprove();
      } else {
        runSwap();
      }
    }
  };

  const runApprove = () => {
    dispatch({
      type: APPROVE_SWAP,
      setLoading: setLoading,
      approveChange: setApprovedSwap,
      payload: {
        amountIn: fromValue,
        tokenA: fromToken,
      },
    });
  };

  const runSwap = () => {
    dispatch({
      type: RUN_SWAP,
      setLoading: setLoading,
      setError: setError,
      setValue: setToValue,
      resetForm: resetForm,
      payload: {
        fromToken: fromToken,
        toToken: toToken,
        fromValue: fromValue,
        toValue: toValue,
      },
    });
  };

  const computeTarget = (value) => {
    console.log("computeTarget", value);
    setError(undefined);
    if (value < 0) value = 0;
    // value = Number(value);
    if (isNaN(value)) value = 0;
    setFromValue(value);
    if (!fromToken || !toToken) return;
    debouncedConvertTarget(Number(value));
  };

  const computeOrigin = (value) => {
    setError(undefined);
    if (value < 0) value = 0;
    // value = Number(value);
    if (isNaN(value)) value = 0;
    setToValue(value);
    if (!fromToken || !toToken) return;
    debounceConvertOrigin(Number(value));
  };

  const callConvertTarget = async (value) => {
    console.log("callConvertTarget ", value);
    console.table({
      fromAddress: fromToken?.smartContractAddress,
      toAddress: toToken?.smartContractAddress,
    });
    const amount = await getAmoutEquivalent(
      Number(value),
      fromToken?.smartContractAddress,
      toToken?.smartContractAddress
    );
    console.log("Amount ", amount);
    if (amount !== undefined && amount > 0) {
      setToValue(amount);
      setError(false);
    } else {
      setError("No Pair for this Trade or Insufficient Liquidity");
    }
  };

  const callConvertOrigin = async (value) => {
    const amount = await getAmoutEquivalent(
      Number(value),
      toToken?.smartContractAddress,
      fromToken?.smartContractAddress
    );

    if (amount !== undefined && amount > 0) {
      setFromValue(amount);
      setError(false);
    } else {
      setError("No Pair for this Trade or Insufficient Liquidity");
    }
  };

  const debouncedConvertTarget = useDebouncedCallback(async (value) => {
    console.log("debouncedConvertTarget", value);
    if (
      value &&
      value > 0 &&
      toToken &&
      toToken?.smartContractAddress &&
      fromToken?.smartContractAddress
    ) {
      await callConvertTarget(value);
    }
  }, 550);

  const debounceConvertOrigin = useDebouncedCallback(async (value) => {
    console.log("debounceConvertOrigin", value);
    if (
      value &&
      value > 0 &&
      toToken &&
      toToken?.smartContractAddress &&
      fromToken?.smartContractAddress
    ) {
      await callConvertOrigin(value);
    }
  }, 550);

  const switchAndConvert = () => {
    console.log("SWICH BETWEEN CURRENCIES");
    const from = fromToken;
    const to = toToken;
    setFromToken(to);
    setToToken(from);
    setFromValue(toValue);
    debouncedConvertTarget(fromValue);
  };

  useEffect(() => {
    if (fromToken && toToken) {
      debouncedConvertTarget(fromValue);
    }
  }, [fromToken, toToken]);

  const isEthToWeth = () =>
    (fromToken?.symbol.toLowerCase() === "eth" &&
      toToken?.symbol.toLowerCase() === "weth") ||
    (fromToken?.symbol.toLowerCase() === "weth" &&
      toToken?.symbol.toLowerCase() === "eth");

  const getSwappingLabel = useCallback(() => {
    if (!isConnected) {
      return "Connect Wallet";
    } else if (isEthToWeth()) {
      return "Swap";
    } else if (toToken?.symbol === "eth" && !approvedSwap) {
      return "Approve";
    } else {
      return "Swap";
    }
  }, [isConnected, toToken, approvedSwap]);

  const handleMaxFrom = () => {
    if (fromToken && toToken && fromBalance) {
      setFromValue(fromBalance);
      computeTarget(fromBalance);
    }
  };

  const handleMaxTo = () => {
    if (fromToken && toToken && toBalance) {
      setToValue(toBalance);
      computeOrigin(toBalance);
    }
  };

  return (
    <div className=" lg:w-11/12   w-10/12 mx-auto  mb-24">
      <SettingsPopup
        shouldShow={showPopup === "settings"}
        closePopup={() => setShowPopup(null)}
      />
      <TokenSelect
        shouldShow={showPopup === "select"}
        closePopup={() => {
          setShowPopup(null);
          setSelectTarget(null);
        }}
        setFromToken={handleFromToken}
        setToToken={handleToToken}
        selectTarget={selectTarget}
        options={UsedCoins}
        chain={chain}
      />

      <PageTitle title="Exchange" />
      <div className="lg:grid flex lg:grid-cols-5 grid-cols-1 gap-8 mt-8 relative z-[7] justify-center ">
        <div className=" col-start-2 col-end-5 rounded-xl h-max relative z-20 shadow-box bg-gradientBlue mt-4 w-full">
          <div className="bg-gradientContainer p-6 rounded-xl h-max shadow-box m-px">
            <div className=" pb-2 border-b border-white flex items-center justify-between">
              <p className="font-syneBold text-2xl text-white">Swap</p>
              <div className="flex gap-2">
                <IoReload className="inline-block mr-2 w-5 h-5 text-text transition-all duration-200 ease-in-out -rotate-45 hover:-rotate-[30deg] cursor-pointer" />
                <RiSettingsLine
                  className="inline-block w-5 h-5 text-text transition-all duration-200 ease-in-out hover:scale-110 cursor-pointer"
                  onClick={() => setShowPopup("settings")}
                />
              </div>
            </div>
            <div className=" mt-12 ">
              <div className="flex xl:items-center xl:flex-row flex-col sm:gap-8 gap-6 justify-between mb-8">
                <TokenSelectInput
                  tokenSelected={fromToken}
                  label={"From"}
                  onTokenOpen={() => {
                    setShowPopup("select");
                    setSelectTarget("from");
                  }}
                  onTokenRemove={() => handleRemoveFromToken()}
                />
                <div className="grow relative">
                  <div className="py-3 pl-6 pr-2 rounded-3xl bg-inputs flex items-center grow  ">
                    <input
                      type="number"
                      placeholder="0"
                      className="bg-transparent text-white grow text-xl w-full outline-none"
                      value={fromValue}
                      onChange={(e) => {
                        console.log("On change value");
                        computeTarget(e.target.value);
                      }}
                    />
                    <p
                      className="pl-2 pr-6 cursor-pointer text-xs h-max border-l-2 border-white text-white"
                      onClick={handleMaxFrom}
                    >
                      Max
                    </p>
                  </div>
                  <p className="text-end text-sm text-text font-kanitLight mt-1 mr-3 opacity-70 absolute top-full right-0 translate-y-1">
                    Balance: {fromBalance || 0}{" "}
                    {fromToken?.symbol.toUpperCase()}
                  </p>
                </div>
              </div>

              <BsArrowDownUp
                className="block w-8 h-8 text-buttonAccentHover opacity-50 cursor-pointer  mx-auto mt-4 mb-8 sm:mx-0"
                onClick={() => {
                  // swap tokens and values
                  switchAndConvert();
                }}
              />
              <div className="flex xl:flex-row flex-col sm:gap-8 gap-3 xl:items-center justify-between mb-12">
                <TokenSelectInput
                  tokenSelected={toToken}
                  label={"To"}
                  onTokenOpen={() => {
                    setShowPopup("select");
                    setSelectTarget("to");
                  }}
                  onTokenRemove={() => handleRemoveToToken()}
                />
                <div className="grow relative">
                  <div className="py-3 pl-6 pr-2 rounded-3xl bg-inputs flex items-center ">
                    <input
                      type="number"
                      placeholder="0"
                      className="bg-transparent text-white w-full text-xl outline-none"
                      value={toValue}
                      onChange={(e) => {
                        computeOrigin(e.target.value);
                      }}
                    />
                    <p
                      className="pl-2 pr-6 cursor-pointer text-xs h-max border-l-2 border-white text-white"
                      onClick={handleMaxTo}
                    >
                      Max
                    </p>
                  </div>
                  <p
                    className="text-end text-sm text-text font-kanitLight mt-1 mr-3 opacity-70 absolute top-full right-0 translate-y-1"
                    onClick={() => setToValue(toBalance)}
                  >
                    Balance: {toBalance || 0} {toToken?.symbol.toUpperCase()}
                  </p>
                </div>
              </div>
              {amount1UnitEquivalent && (
                <div className="py-6 mt-6 border-t border-border flex items-center font-kanitLight text-xs gap-3 text-text opacity-75">
                  <BiInfoCircle className="inline-block w-4 h-4 text-text" />
                  <p>
                    1 {fromToken?.symbol.toUpperCase()} ={" "}
                    {amount1UnitEquivalent} {toToken?.symbol.toUpperCase()}{" "}
                  </p>
                </div>
              )}

              <div className="py-6 border-t border-border flex items-center font-kanitLight text-xs gap-3 text-text opacity-75 justify-between">
                <div className="flex items-center gap-3">
                  <p> Slippage Tolerance</p>
                  <RiSettingsLine
                    className="inline-block w-4 h-4 text-text transition-all duration-200 ease-in-out hover:scale-110 cursor-pointer"
                    onClick={() => setShowPopup("settings")}
                  />
                </div>
                <p>{process.env.REACT_APP_SLIPPAGE}%</p>
              </div>
              <div className="py-6 border-t border-border flex flex-col font-kanitLight text-xs gap-3 text-text opacity-75">
                {/*
<div className="flex items-center gap-3 justify-between">
                  <p>Fee </p>
                  <p>0 ETH</p>
                </div>
                <div className="flex items-center gap-3 justify-between">
                  <p>Price Impact </p>
                  <p>0.0%</p>
                </div>
                  */}

                <div className="flex items-center gap-3 justify-between">
                  <p>Minimum Received </p>
                  <p>
                    {receivedAmount} {toToken?.symbol.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                className="disabled:cursor-not-allowed disabled:opacity-50 bg-gradientBlue rounded-3xl w-full mt-4 text-black font-syneBold cursor-pointer transition-all duration-200 ease-in-out hover:hue-rotate-[20deg] text-center py-3 text-xl"
                onClick={runSwapOrConnectWallet}
                disabled={loading || error}
              >
                {getSwappingLabel()}
              </button>
              {error && (
                <p className="font-syneBold text-lg text-red-600 text-center py-3 mt-6 md:w-4/5 w-full mx-auto">
                  {error}
                </p>
              )}
              {loading && (
                <ColorRing
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper mx-auto mt-4"
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
        {/* <div className="lg:col-span-3 bg-pageBackground p-6 pb-[72px] rounded-xl max-h-[580px] h-full relative z-20 mt-4">
          <div className="flex flex-col gap-1">
            <p className="font-syneBold text-2xl text-text">
              {fromToken?.symbol.toUpperCase() || "ZKLAB"} / USD
            </p>
            <p className="font-kanitLight text-textAccent text-sm">
              {fromToken?.symbol.toUpperCase() || "ZKLAB"} = $
              {fromToken?.current_price} USD
            </p>
          </div>
          <LineChart className={`h-full`} />
        </div> */}
      </div>
    </div>
  );
};

export default HomePage;
