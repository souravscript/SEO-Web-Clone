
import connectToDatabase from "@/db/db-connect";
//import Doc from "@/models/Doc";
import { NextResponse } from "next/server";
import Docs from "@/models/Docs";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import { generateBlog } from "@/lib/generateBlog";

export async function POST(req) {
    await connectToDatabase();

    // Authenticate the user
    try{
    const { user, error } = await authenticate(req);
    if (error) {
        return NextResponse.json({ "Error message":error }, { status: 401 });
    }

    // Parse the request body
    const { title } = await req.json();
    if (!title) {
        return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
    }
    const content=await generateBlog(title)
    //console.log("User ID:", user._id);

    // Create a new Document associated with the user
    const authUser=await User.findOne({supabaseId:user.sub})
    //console.log("auth user", authUser)
    //console.log("This is supabase user",user)
    //console.log("This is mongo user ", JSON.stringify(authUser))
    //const Documents = await Docs.findOne({ userId:authUser.id });
    const newDoc = await Docs.create({ userId: authUser._id, title, content });
    console.log(newDoc)

    return NextResponse.json(newDoc, { status: 201 });
}catch(err){
    return NextResponse.json({ error: err.message }, { status: 500 });

}
}



export async function GET(req) {
    await connectToDatabase();

    try {
        // Authenticate the user
        const { user, error } = await authenticate(req);
        if (error) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        console.log("Authenticated Supabase user ID:", user);

        // Find the authenticated user in MongoDB
       const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch documents associated with the authenticated user
        const documents = await Docs.find({ userId: authUser._id }); 

        //console.log("MongoDB User:", JSON.stringify(authUser));
        //console.log("User Documents:", documents);

        // Return documents in the response
        return NextResponse.json({ documents }, { status: 200 });
    } catch (err) {
        console.error("Error fetching documents:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}


