import { verifyToken } from "./verifyToken";

export async function authenticateWithCookie(req) {
    // Get the cookie header
    const cookieHeader = req.headers.get("cookie");
    
    if (!cookieHeader) {
      return { error: "No cookies found in request headers" };
    }
  
    // Parse the cookies to find `access_token`
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((cookie) => {
        const [key, value] = cookie.trim().split("=");
        return [key, value];
      })
    );
  
    const token = cookies["access_token"]; // Adjust the key to match your token's cookie name
  
    if (!token) {
      return { error: "access_token not found in cookies" };
    }
  
    console.log("Token received: ", token);
  
    // Verify the token
    const { user, error } = verifyToken(token);
    if (error) {
      return { error };
    }
  
    // Return the user if verification is successful
    return { user };
  }
  