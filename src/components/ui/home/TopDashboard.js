"use client";

import { setInitialTokenValue } from "@/redux/tokenSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

const TopDashboard = () => {
    const dispatch=useDispatch()
    // const localUser = localStorage.getItem("user");
    // const user= localUser ? JSON.parse(localUser) : null;
    // const localToken=localStorage.getItem("token")
    // const token=localToken? JSON.parse(localToken) : 'null'

    const localUser = Cookies.get("user");

    let user = null;
    try {
    user = localUser ? JSON.parse(localUser) : null;
    } catch (error) {
    console.error("Error parsing user from cookies:", error);
    user = null;
    }

    const localToken = Cookies.get("token") || null;
    dispatch(setInitialTokenValue(localToken));

    const fullName = user?.fullName?.split(" ")[0];

    // console.log(user)

    return (
        <div className="text-center flex flex-col items-start space-y-8">
            {/* Display the user's email if available */}
            <h1 className="text-3xl font-semibold">Hi {fullName || user?.email || "Guest"}👋🏻,</h1>
            <div className="flex flex-col items-start ">
              <p className="text-gray-600">Start creating different modules to optimize your website.</p>
            </div>
        </div>
    );
};

export default TopDashboard;
