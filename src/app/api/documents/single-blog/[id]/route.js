import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import Docs from "@/models/Docs";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";



export async function GET(req, { params }) {
    await connectToDatabase();

    try {
        // Authenticate the user
        const { user, error } = await authenticate(req);
        console.log("user from authentication: ",user)
        if (error) {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        // Find the authenticated user
        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        //console.log("authUser check ",authUser)
        // Extract document ID from params
        const { id } = params; 
        if (!id) {
            console.log("ID unable to get")
            return NextResponse.json({ message: "Document ID is required" }, { status: 400 });
        }

        console.log("The requested id is :",id)
        // Validate the document ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid document ID" }, { status: 400 });
        }

        // Fetch the specific document
        const document = await Docs.findOne({ _id: id, userId: authUser._id });
        console.log("The document to get: ",document)
        if (!document) {
            return NextResponse.json(
                { message: "Document not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json({ document }, { status: 200 });
    } catch (err) {
        console.error("Error fetching document:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}



export async function DELETE(req, { params }) {
    await connectToDatabase();
    try {
  
      // Example of authentication logic (assumes some user context from the request)
      const {user, error } = await authenticate(req); 
      console.log("Doc to be deleted in the User", user);
      if (error) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
      }
      const { id } = params; 
        if (!id) {
            console.log("ID unable to get")
            return NextResponse.json({ message: "Document ID is required" }, { status: 400 });
        }

        console.log("The requested id is :",id)
        // Validate the document ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid document ID" }, { status: 400 });
        }

      // Verify the authenticated user
      const authUser = await User.findOne({supabaseId: user.sub });
      if (!authUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
  
      // Delete the document
      const doc=await Docs.findByIdAndDelete({_id:id ,userId:authUser._id});

  
      return NextResponse.json({ message: "Document deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting document:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  