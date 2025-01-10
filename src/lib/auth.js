
import { login, logout } from "@/redux/authSlice";
import { supabase } from "@/lib/supabase"
import Cookies from "universal-cookie"
import { reset } from "@/redux/singleBlogFormProgressSlice";

const cookies=new Cookies(null,{path:'/'})


export const handleSignup = async (email, password) => {
  try {
    // Supabase authentication
    const { data, error } = await supabase.auth.signUp({ email, password,options: {
      emailRedirectTo: 'https://seo-web-clone-iufe.vercel.app/auth',
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
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error.message);
    return null;
  }
  cookies.remove('session', {
    path: '/', // Ensure the same path is used as when the cookie was set
  });
  dispatch(logout());
  dispatch(reset())
};


export const handleLogin = async (email, password, dispatch) => {
  try {
    console.log("handleLogin called with:", email, password);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Supabase login error:", error.message);
      throw new Error(error.message || "Supabase login failed");
    }

    const userSessionData = JSON.stringify({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user,
    });

    console.log("Supabase login successful. User session data:", data);

    // Save the session data to localStorage
    localStorage.setItem("session", userSessionData);
    console.log("Stored session data in localStorage");

    // Dispatch the user data
    dispatch(login(data.user));
    console.log("Dispatched user data:", data.user);
  } catch (error) {
    console.error("Login error:", error.message);
    throw error; // Optional: Pass this error to higher-level error handlers
  }
};





 export const handleSignInWithGoogle=async (dispatch) =>{
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    //token: response.credential,
  })
  console.log("Data with oAuth ", data)
  if (error) {
    console.log(error.message);
    return null;
  }

  // Handle user data after successful login
  // if (user) {
  //   dispatch(login(user));  // Dispatch user data to store if needed
  // }
}