// src/redux/formProgressSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  percent:0,
  currentTabIndex:0,
  totalFields: 14,
  filledFormFields: 0,
  tabs: [
    { name: "Core Settings", isCheckedOut: false},
    { name: "Details", isCheckedOut: false,},
    { name: "SEO", isCheckedOut: false,},
    { name: "Link", isCheckedOut: false,},
    { name: "Publish", isCheckedOut: false,},
  ],
};

const formProgressSlice = createSlice({
  name: "formProgress",
  initialState,
  reducers: {
    calculatePercentage: (state) => {
      console.log("filled fields",state.filledFormFields)
      state.percent = ((state.filledFormFields) / state.totalFields) * 100;
    },
    setFieldCountIncrement: (state, action) => {
      state.filledFormFields = Math.min((state.filledFormFields) + (action.payload), state.totalFields);
      state.percent = (state.filledFormFields / state.totalFields) * 100;
    },
    setFieldCountDecrement: (state, action) => {
      state.filledFormFields = Math.max((state.filledFormFields) - (action.payload), 0);
      state.percent = (state.filledFormFields / state.totalFields) * 100;
    },
    reset: (state) => {
      state.filledFormFields = 0;
      state.tabs.forEach((tab)=>{
        tab.isCheckedOut=false;
      })

    },
    setTabIndex: (state, action) => {
      state.currentTabIndex = action.payload;
    },
    markTabChecked: (state, action) => {
      // const { index } = action.payload;
      const {tabName}=action.payload
      //console.log("extracted tab name ",tabName)
      const tab = state.tabs.find((t) => t.name === tabName);
      //console.log("tab name",tab)
      if (tab) tab.isCheckedOut = true;
      //state.tabs[state.currentTabIndex-1].isCheckedOut=true
    },
    markTabUnchecked:(state,action)=>{
      //const { index } = action.payload;
      const {tabName}=action.payload
      const tab = state.tabs.find((t) => t.name === tabName);
      if (tab) tab.isCheckedOut = false;
      //state.tabs[state.currentTabIndex].isCheckedOut=false;
    }
  },
});

export const { setFieldCountIncrement,calculatePercentage,setFieldCountDecrement, markTabChecked, markTabUnchecked, reset, setTabIndex } =
  formProgressSlice.actions;
export default formProgressSlice.reducer;
