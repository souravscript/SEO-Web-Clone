import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/authSlice"
import formReducer from "@/redux/singleBlogFormSlice"
import formProgressReducer from "@/redux/singleBlogFormProgressSlice";
import profileReducer from "@/redux/profileSlice"



export const store=configureStore({
    reducer:{
        auth:authReducer,
        form: formReducer,
        formProgress: formProgressReducer,
        profile: profileReducer
    },
})