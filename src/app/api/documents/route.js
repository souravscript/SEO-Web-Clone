
import connectToDatabase from "@/db/db-connect";
//import Doc from "@/models/Doc";
import { NextResponse } from "next/server";
import Docs from "@/models/Docs";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";

export async function POST(req) {
    await connectToDatabase();

    // Authenticate the user
    try{
    const { user, error } = await authenticate(req);
    if (error) {
        return NextResponse.json({ error }, { status: 401 });
    }

    // Parse the request body
    const { title, content } = await req.json();
    if (!title || !content) {
        return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
    }

    //console.log("User ID:", user._id);

    // Create a new Document associated with the user
    const authUser=await User.findOne({supabaseId:user.supabaseId})

    console.log("This is supabase user ",user)
    console.log("This is mongo user ", authUser)
    //const Documents = await Docs.findOne({ userId:authUser.id });
    const newDoc = await Docs.create({ userId: authUser.id, title, content });

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
            return NextResponse.json({ error }, { status: 401 });
        }
        
        console.log("user id",user.id)



        const authUser=await User.findOne({supabaseId:user.supabaseId})
        const Documents = await Docs.findOne({ userId:authUser.id });
        //const Documents = await Docs.findOne({ userId:user.id });

        // Return Documents in the response
        return NextResponse.json({ Documents }, { status: 200 });
    } catch (err) {
        //console.error("Error fetching Documents:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });

    }
}