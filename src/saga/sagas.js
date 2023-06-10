import { all } from "redux-saga/effects";

import { loadUser } from "./userSaga";
import {
  addLiquiditySaga,
  removeLiquiditySaga,
  approveLiquidity,
  approveRemoveLiquidity,
  approveSwap,
  runSwap,
} from "./web3Saga";

function* watchAll() {
  yield all([
    loadUser(),
    addLiquiditySaga(),
    removeLiquiditySaga(),
    approveLiquidity(),
    approveRemoveLiquidity(),
    runSwap(),
    approveSwap(),
  ]);
}

export default watchAll;
