import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import createSagaMiddleware from "redux-saga";
import localforage from "localforage";
import { persistStore, persistReducer } from "redux-persist";
import watchAll from "../saga/sagas";

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const makeStore = () => {
  const persistConfig = {
    key: "root",
    storage: localforage,
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: [sagaMiddleware],
  });

  store.__persistor = persistStore(store);

  return store;
};

export const store = makeStore();

export const persistor = persistStore(store);

sagaMiddleware.run(watchAll);
