"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ProtectedRoute=({children})=>{
    const {user,isLoggedIn}=useSelector((state)=>state.auth)
    //const user=localStorage.getItem('session')
    useEffect(()=>{
        if( !user){
            redirect('/auth')
        }

    },[user,isLoggedIn])
    return user? children : null;
}
export default ProtectedRoute;


// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const ProtectedRoute = ({ children }) => {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(null); // Null for loading state

//   useEffect(() => {
//     const session = localStorage.getItem("session");

//     if (!session) {
//       setIsAuthenticated(false); // User is not authenticated
//       router.replace("/auth"); // Redirect to /auth
//     } else {
//       setIsAuthenticated(true); // User is authenticated
//     }
//   }, [router]);

//   // Render a loading spinner or placeholder while checking authentication
//   if (isAuthenticated === null) {
//     return <div>Loading...</div>; // Optional: Add a spinner or skeleton UI
//   }

//   return isAuthenticated ? children : null;
// };

// export default ProtectedRoute;

