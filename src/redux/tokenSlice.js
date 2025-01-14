
const { createSlice } = require("@reduxjs/toolkit");

const initialState={
    token:300,
}
const tokenSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setToken(state,action){
            state.userProfile=action.payload;
        }
    },
})

const { actions, reducer } = authSlice
export const { setToken } = actions;
export default reducer;