import jwt from "jsonwebtoken"


export const generateToken=(user)=>{
    // Create JWT token
    const jsonWebToken = jwt.sign(
        { id: user.supabaseId, email: user.email }, // Include only essential details
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: "6d" } // Token expires in days
      );

      return jsonWebToken;
  
}