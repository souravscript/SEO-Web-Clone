import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import Docs from "@/models/Docs"; // Ensure this import is correct
import { NextResponse } from "next/server";
import { extractTitleFromContent } from "@/lib/extractTitle";

export async function POST(req) {
    await connectToDatabase(); // Ensure the database connection is established

    try {
        // Authenticate the user
        const { user, error } = await authenticate(req);
        if (error) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse the request body
        const {content } = await req.json();
       

        // Find the authenticated user in the database
        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log("Authenticated user:", authUser);
        const userDocs = await Docs.find({ userId: authUser._id, docType: 'roundup' });
        // Create a new document in the database
        //const title= `Roundup ${userDocs.length + 1}`
        const title=await extractTitleFromContent(content)
        const newDoc = await Docs.create({
            userId: authUser._id,
            title:title,
            content: content,
            docType: 'roundup', // Ensure this matches your schema
        });

        if (newDoc) {
            console.log("New document created:", newDoc);

            // Deduct a token from the user's account
            authUser.token -= 1;
            await authUser.save();
        }

        // Return the newly created document
        return NextResponse.json(newDoc, { status: 201 });

    } catch (err) {
        console.error("Error in POST route:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}