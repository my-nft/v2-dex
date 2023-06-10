// import { call, put, select, takeLatest } from "redux-saga/effects";
// import { selectCurrentWallet, setToken } from "../redux/userReducer";
import { takeLatest } from "redux-saga/effects";
import { LOAD_USER } from "./actions";
// import { signIn, signUp } from "../interactors/authInteractor";
// import { toast } from "react-toastify";

// Worker saga will be fired on USER_FETCH_REQUESTED actions
function* getConnectedUser(action) {}

export function* signWallet() {
  // const connectedWallet = yield select(selectCurrentWallet);
  // const { token } = yield call(signIn, connectedWallet);
  // yield put(setToken(token));
  // return token;
}

// Starts fetchUser on each dispatched USER_FETCH_REQUESTED action
// Allows concurrent fetches of user

function* loadUser() {
  yield takeLatest(LOAD_USER, getConnectedUser);
}

export { loadUser };
