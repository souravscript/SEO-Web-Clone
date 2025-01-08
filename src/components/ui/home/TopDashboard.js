"use client";
import { useSelector } from "react-redux";

const TopDashboard = () => {
    // Get the logged-in user's data from the Redux store
    const user = useSelector((state) => state.auth.user);
    console.log(user)

    return (
        <div className="text-center flex flex-col items-start space-y-8">
            {/* Display the user's email if available */}
            <h1 className="text-3xl font-semibold">Hi {user ? user.email : "Guest"}👋🏻,</h1>
            <div className="flex flex-col items-start ">
              <p className="text-gray-600">Start creating different modules to optimize your website.</p>
            </div>
        </div>
    );
};

export default TopDashboard;
