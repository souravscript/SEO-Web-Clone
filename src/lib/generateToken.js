import jwt from "jsonwebtoken"
const JWT_SECRET_KEY="SEO_ENGINE"

export const generateToken=(user)=>{
    // Create JWT token
    const jsonWebToken = jwt.sign(
        { id: user.supabaseId, email: user.email }, // Include only essential details
        JWT_SECRET_KEY,
        { expiresIn: "6d" } // Token expires in days
      );

      return jsonWebToken;
  
}