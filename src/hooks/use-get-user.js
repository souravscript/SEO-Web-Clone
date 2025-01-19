"use client";
// import { useEffect, useState } from "react";

import { useEffect, useState } from "react";
import { useCookieValue } from "./useCookie";
import { useSelector } from "react-redux";

export const useGetUser = (url) => {
    //const session = localStorage.getItem("session");
    // if (!session) {
    //     throw new Error("Session data is not available in localStorage");
    // }

    // const { access_token } = JSON.parse(session);
    const access_token=useCookieValue('access_token')
    const [user, setUser] = useState(null);
    const token=useSelector((state) => state.auth.token);

    const getUser = async () => {
        try {
            const response = await fetch(`${url}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    //Authorization: `Bearer ${access_token}`,
                },
                credentials: 'include',
            });
            const result = await response.json();
            setUser(result.authUser);
            //console.log("User data fetched successfully: in navbar", result);
        } catch (err) {
            console.log("Error fetching user data: ", err);
        }
    };

    useEffect(() => {
        // Only call the function if `user` is null to prevent repeated calls
        if (!user && token) {
            getUser();
        }
    }, [user,token]); // Add `user` as a dependency

    return user;
};
