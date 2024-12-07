import { login, logout } from "@/redux/authSlice";
import { supabase } from "@/lib/supabase"
import { useRouter } from 'next/router';
import { redirect } from "next/navigation";

export const handleSignup = async (email, password, dispatch) => {
  try {
    // Supabase authentication
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error || !data) {
      console.log("Supabase SignUp Error:", error?.message || "Unknown error");
      return { user: null, error };
    }

    // Call backend to register user in the database
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const backendError = await res.json();
      console.log("Backend Register Error:", backendError.message);
      return { user: null, error: backendError };
    }

    const registeredUser = await res.json();

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
  dispatch(logout());
};




export const handleLogin = async (email, password, dispatch) => {
    try {
        // Attempt to sign in the user
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.log("Error detected:", error);
            throw error;
        }

        // Call your backend API for login
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            console.log("Failed to log in via API");
            throw new Error("Failed to log in via API");
        }

        // Dispatch the login action with user data
        dispatch(login(data.user));
        console.log("Login Successful:", data);

        // Redirect to home page
        //redirect("/");
        
        return data.user;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};



 export const handleSignInWithGoogle=async (dispatch) =>{
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
  })

  if (error) {
    console.log(error.message);
    return null;
  }

  // Handle user data after successful login
  if (user) {
    dispatch(login(user));  // Dispatch user data to store if needed
  }
}