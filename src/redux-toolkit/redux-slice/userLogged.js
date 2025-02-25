import { createSlice } from "@reduxjs/toolkit";
import { updateUserLoggedEveryReload } from "../thunkAction/updatedUserLoggedEveryReload";

const initialState = {
  userLogged: null,
  cart: null,
};

const userLoggedSlice = createSlice({
  //tên của slice
  name: "userLoggedSlice",

  //state ban đầu của slice
  initialState,

  //reducer của slice
  reducers: {
    //cập nhật tài khoản của người dùng đang đăng nhập vào state chung của redux
    //payload của action là 1 userLogged mới, có thể là lúc người dùng đăng nhập hoặc khi người dùng cập nhật thông tin tài khoản
    updateUserLogged: (state, action) => {
      state.userLogged = action.payload.user;

      state.cart = action.payload.cart ? action.payload.cart : state.cart;
    },

    //cập nhật mỗi

    //updateCart
    updateCart: (state, action) => {
      state.cart = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(updateUserLoggedEveryReload.fulfilled, (state, action) => {
        console.log("Fulfilled payload: ", action.payload);

        state.userLogged = action.payload.user;
        state.cart = action.payload.cart;
      })
      .addCase(updateUserLoggedEveryReload.rejected, (state, action) => {
        console.log("Rejected payload:", action.payload);
        // Xử lý khi không có accessToken hoặc lỗi xảy ra
        // Ví dụ: reset lại userLogged và cart về trạng thái ban đầu
        state.userLogged = null;
        state.cart = null;
      });
  },
});

//export các actions creator từ các reducer
export const { updateUserLogged, updateCart } = userLoggedSlice.actions;

export default userLoggedSlice.reducer;
