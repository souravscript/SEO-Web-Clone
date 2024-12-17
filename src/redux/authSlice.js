const { createSlice } = require("@reduxjs/toolkit");

const initialState={
    isLoggedIn:false,
    user:null,
}
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
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
export const { login,logout } = actions;
export default reducer;