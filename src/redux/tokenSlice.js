
const { createSlice } = require("@reduxjs/toolkit");
const initialState={
    token:0,
}
const tokenSlice=createSlice({
    name:"token",
    initialState,
    reducers:{
        setInitialTokenValue(state,action){
            state.token=action.payload
        },
        setTokenAfterBlog(state,action){
            state.token-=action.payload;
        },
        resetToken(state){
            state.token=0
        }
    },
})

const { actions, reducer } = tokenSlice
export const { setTokenAfterBlog, resetToken, setInitialTokenValue } = actions;
export default reducer;