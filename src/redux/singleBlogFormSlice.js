import { createSlice } from "@reduxjs/toolkit";

// Initial state for form data
const initialState = {
  mainKeyword: '',
  title: '',
  coreSettings: {
    aiModel: 'GPT-4',
    language: 'English',
    targetCountry: 'USA',
    toneOfVoice: 'Professional',
    articleSize: 'Medium',
  },
  details: {
    includeDetails: '',
    structure: 'introductory',
    openingSentence: '',
    elements: ['conclusion'],
  },
  seo: {
    keywords: ''
  },
  link: {
    connectToWeb: 'None',
    url: ''
  },
  publish: {}
};

// Create a slice of state with reducers
const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    setCoreSettings: (state, action) => {
      state.coreSettings = { ...state.coreSettings, ...action.payload };
    },
    setDetails: (state, action) => {
      state.details = { ...state.details, ...action.payload };
    },
    setSeo: (state, action) => {
      state.seo = { ...state.seo, ...action.payload };
    },
    setLink: (state, action) => {
      state.link = { ...state.link, ...action.payload };
    },
    setPublish: (state, action) => {
      state.publish = { ...state.publish, ...action.payload };
    },
    resetForm(state) {
      return initialState;
    },
  },
});

// Export the actions and reducer
export const { setFormData, setCoreSettings, setDetails, setSeo, setLink, setPublish } = formSlice.actions;
export default formSlice.reducer;
