import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  visible: false,
  endpoint: "",
};

const popupAlertSlice = createSlice({
  name: "popupAlert",
  initialState,
  reducers: {
    showPopupAlert: (state, action) => {
      state.message = action.payload.message;
      state.endpoint = action.payload.enpoint;
      state.visible = true;
    },

    hidePopupAlert: (state) => {
      state.visible = false;
    },
  },
});

export const { showPopupAlert, hidePopupAlert } = popupAlertSlice.actions;
export default popupAlertSlice.reducer;
