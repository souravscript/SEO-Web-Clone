import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/authSlice"
import formProgressReducer from "@/redux/singleBlogFormProgressSlice";
import tokenReducer from "@/redux/tokenSlice"



export const store=configureStore({
    reducer:{
        auth:authReducer,
        formProgress: formProgressReducer,
        token: tokenReducer
    },
})