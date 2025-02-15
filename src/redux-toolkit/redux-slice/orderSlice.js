import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderAddress: {},
};

const orderSlice = createSlice({
  name: "orderSlice",

  initialState,

  reducers: {
    updateOrderAddress: (state, action) => {
      state.orderAddress = action.payload;
    },
  },
});

export const { updateOrderAddress } = orderSlice.actions;

export default orderSlice.reducer;
