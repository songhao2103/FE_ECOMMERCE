import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  pendingActions: [],

  error: {
    statusCode: "",
    message: "",
  },
};

const statusGlobalSlice = createSlice({
  //tên sile
  name: "statusGlobalSlice",

  //state ban đầu của slice
  initialState,

  //reducer

  reducers: {},

  //dùng addMatcher để bắt tất cả các thunk action nào đang trong trạng thái pending
  extraReducers: (builder) => {
    //bắt tất cả các action có đuôi là pending
    builder.addMatcher(
      (action) => action.type.endsWith("/pending"),
      (state, action) => {
        state.status = "loading";
        state.pendingActions.push(action.type);
      }
    );

    //bắt tất cả các thunk action có đuôi là "/fulfilled" hoặc "/rejected"
    builder.addMatcher(
      (action) =>
        action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected"),
      (state, action) => {
        const pendingAction = action.type
          .replace("/fulfilled", "/pending")
          .replace("/rejected", "/pending");

        state.pendingActions = state.pendingActions.filter(
          (pending) => pending !== pendingAction
        );

        state.status = state.pendingActions.length > 0 ? "loading" : "idle";
      }
    );
  },
});

//export reducer để cập nhật vào store chung

export default statusGlobalSlice.reducer;
