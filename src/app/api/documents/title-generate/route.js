import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
//import Docs from "@/models/Docs"; // Ensure this import is correct
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

        const {keywords } = await req.json();
        


        // Find the authenticated user in the database
        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log("Authenticated user:", authUser);
        
        const response= await fetch('http://34.131.28.178:8080/api/titles/generate-title/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({keywords:keywords}),
        })
        if(!response.ok){
            console.error("Failed to generate title");
            return NextResponse.json({ error: "Failed to generate title" }, { status: 500 });
        }
        const data=await response.json()
        console.log("generated title",data)

        // Return the newly created document
        return NextResponse.json(data, { status: 201 });

    } catch (err) {
        console.error("Error in POST route:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}