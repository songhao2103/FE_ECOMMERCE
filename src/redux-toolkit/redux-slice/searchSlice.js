import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  debouncedValueSearch: "",
};

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    updateSearchValue: (state, action) => {
      state.debouncedValueSearch = action.payload;
    },
  },
});

export const { updateSearchValue } = searchSlice.actions;

export default searchSlice.reducer;
