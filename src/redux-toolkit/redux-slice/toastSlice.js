import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  visible: false,
};

const toastSlice = createSlice({
  name: "toatsSlice",
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message;
      state.visible = true;
    },

    hideToast: (state) => {
      state.visible = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
