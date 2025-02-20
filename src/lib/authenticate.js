import { verifyToken } from "@/lib/verifyToken";

export async function authenticate(req) {
  // // Extract Authorization header
  // const authHeader = req.headers.get("Authorization");
  // //console.log("auth headers: ", authHeader)
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return { error: "Authorization header missing or malformed" , authHeader};
  // }

  // const token = authHeader.split(" ")[1];
  const token = req.cookies.get('access_token')?.value;
  console.log("token recieved: ",token)

  // Verify the token
  const { user, error } = verifyToken(token);
  console.log("user from verify token: ", user)
  if (error) {
    return { error };
  }

  // Return the user if verification is successful
  return { user };
}












 
// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';

// const SECRET = process.env.JWT_SECRET_KEY;

// export function middleware(req) {
//   const accessToken = req.cookies.get('access_token')?.value;

//   // Redirect to login if no access token exists
//   if (!accessToken) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   try {
//     // Verify the access token
//     jwt.verify(accessToken, SECRET);
//     return NextResponse.next();
//   } catch {
//     // Redirect to login if the token is invalid
//     return NextResponse.redirect(new URL('/login', req.url));
//   }
// }

// // Apply middleware to all routes except public ones like /register and /login
// export const config = {
//   matcher: [
//     '/((?!api/(auth/login|auth/register)|_next|static|favicon.ico).*)', // Exclude login and register routes
//   ],
// };

