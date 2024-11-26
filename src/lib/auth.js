import { login, logout } from "@/redux/authSlice";
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation";

export const handleSignup=async(email,password,dispatch)=>{
    const {data,error}=await supabase.auth.signUp({email,password});
    if(error){
        console.error(error.message)
        return null;
    }
    //dispatch(login(data))
    console.log(data.user)
    return data.user
}

 

export const handleLogout = async (dispatch) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error(error.message);
    return null;
  }
  dispatch(logout());
};



export const handleLogin = async (email, password, dispatch) => {
    try {
        // Attempt to sign in the user
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        // If successful, dispatch the login action with user data
        dispatch(login(data.user));

        console.log("Login Successful:", data);
        redirect("/")
        //return { success: true, user: data.user };
    } catch (err) {
        console.error("Unexpected Error during Login:", err.message || err);
        return { success: false, error: err.message || "Unexpected error occurred" };
    }
};

/*
 export const handleSignInWithGoogle=async (dispatch) =>{
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
  })

  if (error) {
    console.error(error.message);
    return null;
  }

  // Handle user data after successful login
  if (user) {
    dispatch(login(user));  // Dispatch user data to store if needed
  }
}
*/