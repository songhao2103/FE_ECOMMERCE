import { configureStore } from "@reduxjs/toolkit";
import userLoggedReducer from "../redux-slice/userLogged";
import statusGlobalReducer from "../redux-slice/statusGlobal";
import toastReducer from "../redux-slice/toastSlice";
import popupAlertReducer from "../redux-slice/popupAlertSlice";

export const store = configureStore({
  reducer: {
    userLoggedSlice: userLoggedReducer,
    statusGlobalSlice: statusGlobalReducer,
    toastSlice: toastReducer,
    popupAlertSlice: popupAlertReducer,
  },
});
