
import { login, logout } from "@/redux/authSlice";
import { supabase } from "@/lib/supabase"
import Cookies from "universal-cookie"

const cookies=new Cookies(null,{path:'/'})


export const handleSignup = async (email, password) => {
  try {
    // Supabase authentication
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error || !data) {
      console.log("Supabase SignUp Error:", error?.message || "Unknown error");
      return { user: null, error };
    }
    console.log("supabase login: ",data)
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
};




export const handleLogin = async (email, password, dispatch) => {
  
  try {
      console.log("handleLogin called with:", email, password);

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log("Supabase login response:", data, error);

      if (error) {
          throw new Error("Supabase login failed");
      }
      //console.log()
      /*const res = await fetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email }),
          headers: { 'Content-Type': 'application/json' },
      });
      console.log("API response:", res);

      if (!res.ok) {
          throw new Error("Failed to log in via API");
      }*/
          /*const userSessionData = JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user,
          });
      
          // Using cookies-next (or you can use native document.cookie):
          cookies.set('session', userSessionData, {
            expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days in the future
          });*/
          const userSessionData = JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user,
          });
          console.log("data from supabase : ",data);
          // Save the session data to localStorage
          localStorage.setItem('session', userSessionData);
      
          console.log("Stored session data in localStorage:", userSessionData);
          console.log("local storage data", localStorage.getItem('session'))
      //console.log("The cookie data is: ",cookies.get('session'))
      dispatch(login(data.user));
      console.log("Dispatched user data:", data.user);
      
  } catch (error) {
      console.log("Login error:", error);
      throw error;
  }
};



/*
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
}*/