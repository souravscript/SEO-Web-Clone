import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import Docs from "@/models/Docs"; // Ensure this import is correct
import { NextResponse } from "next/server";

const DEFAULT_LLM = "openrouter";

export async function POST(req) {
    await connectToDatabase(); // Ensure the database connection is established

    try {
        // Authenticate the user
        const { user, error } = await authenticate(req);
        if (error) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {title,article_size, description } = await req.json();
        


        // Find the authenticated user in the database
        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
         
        const response=await fetch('http://34.131.28.178:8080/api/guides/generate-guide-content/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({title:title, article_size:article_size, description:description, llm:DEFAULT_LLM, verbose:false}),
        })
        //const userDocs = await Docs.find({ userId: authUser._id, docType: 'guide' });
        // Create a new document in the database
        const data=await response.json()

        console.log(" Data from API:", data);


        console.log("Authenticated user:", authUser);
        if (authUser.token < 1) {
            return NextResponse.json({ error: "Insufficient tokens" }, { status: 403 });
        }
        authUser.token=authUser.token-1
        await authUser.save();
        const newDoc = await Docs.create({
            userId: authUser?._id,
            title:title,
            content: data?.content,
            docType: 'guide', // Ensure this matches your schema
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