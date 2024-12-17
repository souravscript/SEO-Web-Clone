import { verifyToken } from "@/lib/verifyToken";

export async function authenticate(req) {
  // Extract Authorization header
  const authHeader = req.headers.get("Authorization");
  console.log("auth headers: ", authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Authorization header missing or malformed" , authHeader};
  }

  const token = authHeader.split(" ")[1];
  console.log("token recieved: ",token)

  // Verify the token
  const { user, error } = verifyToken(token);

  if (error) {
    return { error };
  }

  // Return the user if verification is successful
  return { user };
}
