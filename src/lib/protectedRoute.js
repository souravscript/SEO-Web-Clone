"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ProtectedRoute=({children})=>{
    const {user,isLoggedIn}=useSelector((state)=>state.auth)
    useEffect(()=>{
        if(!isLoggedIn && !user){
            redirect('/auth')
        }

    },[isLoggedIn,user])
    return user? children : null;
}
export default ProtectedRoute;