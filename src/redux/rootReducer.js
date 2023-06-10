import { combineReducers } from "redux";
import UserReducer from "./userReducer";

const reducers = combineReducers({
  user: UserReducer.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === "DESTROY_SESSION") {
    state = undefined;
  }

  return reducers(state, action);
};

export default rootReducer;
