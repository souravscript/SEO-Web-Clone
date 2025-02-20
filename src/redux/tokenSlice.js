const { createSlice } = require("@reduxjs/toolkit");
const initialState={
    token:0
}
const tokenSlice=createSlice({
    name:"token",
    initialState,
    reducers:{
        setInitialTokenValue(state,action){
            state.token=action.payload
        },
        setTokenAfterBlog(state,action){
            // Prevent token from going below 0
            if (state.token - action.payload < 0) {
                throw new Error("Insufficient token balance");
            }
            state.token -= action.payload;
        },
        resetToken(state){
            state.token=0
        }
    },
})

const { actions, reducer } = tokenSlice
export const { setTokenAfterBlog, resetToken, setInitialTokenValue } = actions;
export default reducer;