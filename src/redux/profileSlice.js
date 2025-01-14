import { set } from "nprogress";
import { reset } from "./singleBlogFormProgressSlice";

const { createSlice } = require("@reduxjs/toolkit");

const initialState={
    fullName:"",
    email:"",
    phoneNumber:"",
    token:0
}
const authSlice=createSlice({
    name:"profile",
    initialState,
    reducers:{
        setProfile(state,action){
            state.fullName=action.payload.fullName;
            state.email=action.payload.email;
            state.phoneNumber=action.payload.phoneNumber;
            state.token=action.payload.token;
        },
        setToken(state,action){
            state.token-=action.payload
        },
        resetProfile: (state) => {
            state.fullName = "";
            state.email = "";
            state.phoneNumber = "";
            state.token = 0;
          },
    },
})

const { actions, reducer } = authSlice
export const { setProfile,setToken,resetProfile } = actions;
export default reducer;