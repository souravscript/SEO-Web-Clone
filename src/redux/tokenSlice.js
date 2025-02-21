const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    token: 0
}

const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        setInitialTokenValue(state, action) {
            // Ensure token is a number
            state.token = parseInt(action.payload) || 0;
        },
        setTokenAfterBlog(state, action) {
            const deduction = parseInt(action.payload) || 0;
            // Prevent token from going below 0
            if (state.token - deduction < 0) {
                throw new Error("Insufficient token balance");
            }
            state.token -= deduction;
        },
        resetToken(state) {
            state.token = 0;
        }
    },
})

const { actions, reducer } = tokenSlice;
export const { setTokenAfterBlog, resetToken, setInitialTokenValue } = actions;
export default reducer;