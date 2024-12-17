import connectToDatabase from "@/db/db-connect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET_KEY="m/qSCET7a65mNNqMCUH+MAuLUUXGVFNvcYVcKdilI0KShxKQnv2C1D6Ej0h8O/crrY8csRnTnBJzp/IJM79/9Q=="


export async function POST(req) {
  await connectToDatabase();

  try {
    // Parse request body
    const { email } = await req.json();

    // Validate email input
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Create JWT token
    const jsonWebToken = jwt.sign(
      { id: user._id, email: user.email }, // Include only essential details
      JWT_SECRET_KEY,
      { expiresIn: "3d" } // Token expires in 1 hour
    );

    // Return the user data and token
    return NextResponse.json(
      { user, token: jsonWebToken },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
