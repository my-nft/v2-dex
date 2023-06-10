/* eslint-disable require-yield */
import { call, takeLatest } from "redux-saga/effects";
import {
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  APPROVE_LIQUIDITY,
  APPROVE_REMOVE_LIQUIDITY,
  APPROVE_SWAP,
  RUN_SWAP,
} from "./actions";
import { toast } from "react-toastify";
import {
  swapExactETHForTokens,
  swapExactTokensForETH,
  addLiquidity,
  removeLiquidity,
  appoveLiquidity,
  appoveRemoveLiquidity,
  approveSwapExactTokensForETH,
  swapExactTokensForTokens,
  swapEthToWeth,
  swapWethToEth,
} from "../web3/web3Interactor";

function* handleApproveLiquidity(action) {
  const { setLoading = () => {}, approveChange = () => {}, payload } = action;
  const { from, valueFrom, to, valueTo } = payload;
  try {
    setLoading(true);
    approveChange(false);
    console.log("Approving liquidity sga");
    if (from.symbol === "eth") {
      yield call(appoveLiquidity, valueTo, to?.smartContractAddress);
    } else {
      yield call(appoveLiquidity, valueFrom, from?.smartContractAddress);
    }
    toast.success("Approved successfully");
    approveChange(true);
  } catch (error) {
    toast.error("There was an error adding liquidity");
  } finally {
    setLoading(false);
  }
}

function* handleApproveRemoveLiquidity(action) {
  const { setLoading = () => {}, approveChange = () => {}, payload } = action;
  const { from, valueFrom, to, valueTo } = payload;
  try {
    setLoading(true);
    approveChange(false);
    console.log("Approving removing liquidity sga");
    if (from.symbol === "eth") {
      yield call(appoveRemoveLiquidity, to?.smartContractAddress);
    } else {
      yield call(appoveRemoveLiquidity, from?.smartContractAddress);
    }
    toast.success("Approved successfully");
    approveChange(true);
  } catch (error) {
    toast.error("There was an error removing liquidity");
  } finally {
    setLoading(false);
  }
}

function* handleApproveSwap(action) {
  const { setLoading = () => {}, approveChange = () => {}, payload } = action;
  const { amountIn, tokenA } = payload;
  try {
    setLoading(true);
    approveChange(false);
    yield call(
      approveSwapExactTokensForETH,
      amountIn,
      tokenA?.smartContractAddress
    );
    toast.success("Swap Approved successfully");
    approveChange(true);
  } catch (error) {
    toast.error("There was an error approving swap");
    console.log(error.message);
  } finally {
    setLoading(false);
  }
}

function* handleAddLiquidity(action) {
  const { setLoading = () => {}, onSuccess = () => {}, payload } = action;
  const { from, valueFrom, to, valueTo } = payload;
  try {
    setLoading(true);
    if (from.symbol === "eth") {
      yield call(addLiquidity, valueTo, valueFrom, to?.smartContractAddress);
    } else {
      yield call(addLiquidity, valueFrom, valueTo, from?.smartContractAddress);
    }
    toast.success("Liquidty Added");
    onSuccess();
  } catch (error) {
    console.error(error);
    toast.error("There was an error adding liquidity");
  } finally {
    setLoading(false);
  }
}

function* handleRemoveLiquidity(action) {
  console.log("handleRemoveLiquidity");
  const { setLoading = () => {}, onSuccess = () => {}, payload } = action;
  const { from, to } = payload;
  try {
    setLoading(true);
    if (from.symbol === "eth") {
      yield call(removeLiquidity, to?.smartContractAddress);
    } else {
      yield call(removeLiquidity, from?.smartContractAddress);
    }
    toast.success("Liquidty Removed");
    onSuccess();
  } catch (error) {
    console.error(error);
    toast.error("There was an error removing liquidity");
  } finally {
    setLoading(false);
  }
}

function* handleRunSwap(action) {
  console.log("handleRunSwap")
  const { setLoading = () => {} } = action;
  try {
    setLoading(true);
    const { fromToken, toToken, fromValue } = action.payload;
    
    if(fromToken.symbol.toLowerCase() === "eth" && toToken.symbol.toLowerCase() === "weth") {
      yield call(
        swapEthToWeth,
        fromValue
      );
    } else if(fromToken.symbol.toLowerCase() === "weth" && toToken.symbol.toLowerCase() === "eth") {
      yield call(
        swapWethToEth,
        fromValue
      );
    } else if (fromToken.symbol.toLowerCase() === "eth") {
      yield call(
        swapExactETHForTokens,
        fromValue,
        toToken?.smartContractAddress
      );
    } else if (toToken.symbol.toLowerCase() === "eth") {
      yield call(
        swapExactTokensForETH,
        fromValue,
        fromToken?.smartContractAddress
      );
    } else {
      yield call(
        swapExactTokensForTokens,
        fromValue,
        fromToken?.smartContractAddress,
        toToken?.smartContractAddress
      );
    }
    toast.success("Swap Successful");
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

function* approveLiquidity() {
  yield takeLatest(APPROVE_LIQUIDITY, handleApproveLiquidity);
}

function* approveRemoveLiquidity() {
  yield takeLatest(APPROVE_REMOVE_LIQUIDITY, handleApproveRemoveLiquidity);
}

function* approveSwap() {
  yield takeLatest(APPROVE_SWAP, handleApproveSwap);
}

function* addLiquiditySaga() {
  yield takeLatest(ADD_LIQUIDITY, handleAddLiquidity);
}

function* removeLiquiditySaga() {
  yield takeLatest(REMOVE_LIQUIDITY, handleRemoveLiquidity);
}

function* runSwap() {
  yield takeLatest(RUN_SWAP, handleRunSwap);
}

export { addLiquiditySaga, removeLiquiditySaga, approveLiquidity, approveRemoveLiquidity, runSwap, approveSwap };
