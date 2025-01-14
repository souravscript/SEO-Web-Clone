import { set } from "nprogress";

const { createSlice } = require("@reduxjs/toolkit");

const initialState={
    isLoggedIn:false,
    user:null,
    token:null,
}
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setToken(state,action){
            if(!state.token){
                state.token=action.payload
            }else{
                state.token-=action.payload
            }
            console.log("token in auth slice", state.token)
        },
        login(state,action){
            state.isLoggedIn=true;
            state.user=action.payload;
            
        },
        logout(state){
            state.isLoggedIn=false;
            state.user=null
        },
    },
})

const { actions, reducer } = authSlice
export const { login,logout,setToken } = actions;
export default reducer;