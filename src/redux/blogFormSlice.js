// src/redux/blogFormSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  percent: 0,
  currentTabIndex: 0,
  totalFields: 14,
  filledFormFields: 0,
  tabs: [
    { name: "Core Settings", isCheckedOut: false},
    { name: "Details", isCheckedOut: false},
    { name: "SEO", isCheckedOut: false},
    { name: "Link", isCheckedOut: false},
    { name: "Publish", isCheckedOut: false},
  ],
};

const blogFormSlice = createSlice({
  name: "blogForm",
  initialState,
  reducers: {
    setFieldCountIncrement(state) {
      state.filledFormFields += 1;
      state.percent = Math.round((state.filledFormFields / state.totalFields) * 100);
    },
    setFieldCountDecrement(state) {
      state.filledFormFields -= 1;
      state.percent = Math.round((state.filledFormFields / state.totalFields) * 100);
    },
    markTabChecked(state, action) {
      const tabIndex = action.payload;
      state.tabs[tabIndex].isCheckedOut = true;
    },
    markTabUnchecked(state, action) {
      const tabIndex = action.payload;
      state.tabs[tabIndex].isCheckedOut = false;
    },
    setCurrentTabIndex(state, action) {
      state.currentTabIndex = action.payload;
    },
    reset(state) {
      state.percent = 0;
      state.currentTabIndex = 0;
      state.filledFormFields = 0;
      state.tabs.forEach(tab => tab.isCheckedOut = false);
    },
  },
});

export const { 
  setFieldCountIncrement, 
  setFieldCountDecrement, 
  markTabChecked, 
  markTabUnchecked, 
  setCurrentTabIndex,
  reset 
} = blogFormSlice.actions;

export default blogFormSlice.reducer;
