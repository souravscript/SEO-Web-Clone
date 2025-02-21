
import { login, logout,setToken } from "@/redux/authSlice";
import { supabase } from "@/lib/supabase"
import { reset, resetPercent } from "@/redux/singleBlogFormProgressSlice";
import { resetToken } from "@/redux/tokenSlice";

// import useCookie from "@/hooks/useCookie";
// import { cookies } from "next/headers";


// const userLogin = (user, token) => {
//   // Store user and token in localStorage
//   localStorage.setItem("user", JSON.stringify(user));
//   localStorage.setItem("token", token);
//   localStorage.setItem("isLoggedin",true)
//   // Optional: Log to confirm
//   console.log("User logged in, data stored in localStorage");
// };
// const userLogout = () => {
//   // Clear data from localStorage
//   localStorage.removeItem("user");
//   localStorage.removeItem("token");
//   localStorage.removeItem("isLoggedin")

//   console.log("User logged out, localStorage cleared");
// };
import Cookies from "js-cookie";


const userLogin = (user, token) => {

  const percentData=[0,29,75,79,87,96,100]
  // Store user and token in cookies
  Cookies.set("user", JSON.stringify(user), { expires: 7 }); // Expires in 7 days
  Cookies.set("token", token, { expires: 7 });
  Cookies.set("isLoggedin", true, { expires: 7 });
  Cookies.set("progressState", JSON.stringify(percentData)); 
  

  console.log("token value from login",Cookies.get("token"))
  // Optional: Log to confirm
  console.log("User logged in, data stored in cookies");
};

const userLogout = () => {
  // Clear data from cookies
  Cookies.remove("user");
  Cookies.remove("token");
  Cookies.remove("isLoggedin");
  Cookies.remove("progressState");


  console.log("User logged out, cookies cleared");
};
export const handleSignup = async (email, password) => {
  try {
    // Supabase authentication
    const { data, error } = await supabase.auth.signUp({ email, password,options: {
      emailRedirectTo: `${origin}/auth`,
    }, });

    if (error || !data) {
      console.log("Supabase SignUp Error:", error?.message || "Unknown error");
      return { user: null, error };
    }
    // Call backend to register user in the database
    const supabaseId=data?.user?.id
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email,supabaseId}),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const backendError = await res.json();
      console.log("Backend Register Error:", backendError.message);
      return { user: null, error: backendError };
    }

    const registeredUser = await res.json();
    //redirect('/')
    // Optionally dispatch login action if backend registration succeeds
    //dispatch(login(data.user)); // Uncomment if needed

    console.log("User Registered Successfully:", registeredUser);

    //redirect("/auth"); // Redirect on success
    return { user: registeredUser, error: null };
  } catch (err) {
    console.log("Signup Error:", err.message);
    return { user: null, error: err };
  }
};


 

export const handleLogout = async (dispatch) => {

  // const { error } = await supabase.auth.signOut();
  // if (error) {
  //   console.log(error.message);
  //   return null;
  // }
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include', // Ensure cookies are sent with the request
  });

  if (!res.ok) {
    const error = await res.json();
    //console.error("Logout Error:", error.message);
    return;
  }

  userLogout()
  dispatch(reset())
  dispatch(resetToken())
};


export const handleLogin = async (email, password, dispatch) => {
  try {
    //console.log("handleLogin called with:", email, password);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Ensure cookies are included in the request
    });

    //console.log("cookie data",document.cookie)

    if (!res.ok) {
      const error = await res.json();
      //console.error("Login Error:", error.message);
      throw new Error(error.message || "Login failed");
    }

    // Parse the response to get user data (no need to handle tokens here)
    const responseData = await res.json();
    //console.log("Login response data:", responseData);
    // Dispatch user data to your store (e.g., Redux)
    const { user } = responseData;
    const token=user.token
    console.log("response value from login",responseData)

    
    if(res.ok){
      userLogin(user,token)
    }


    // // Dispatch the user data
    //  dispatch(login(user));
    //  dispatch(setToken(token))
    //console.log("Dispatched user data:", user);

    //console.log("Dispatched token data:", token);
  } catch (error) {
    //console.error("Login error:", error.message);
    throw error; // Optional: Pass this error to higher-level error handlers
  }
};





 export const handleSignInWithGoogle=async (dispatch) =>{
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    //token: response.credential,
  })
  //console.log("Data with oAuth ", data)
  if (error) {
    //console.log(error.message);
    return null;
  }

  // Handle user data after successful login
  // if (user) {
  //   dispatch(login(user));  // Dispatch user data to store if needed
  // }
}