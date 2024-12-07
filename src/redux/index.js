import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/authSlice"
import formReducer from "@/redux/singleBlogFormSlice"



export const store=configureStore({
    reducer:{
        auth:authReducer,
        form: formReducer,
    },
})