import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import { generateBlog } from "@/lib/generateBlog";
import Docs from "@/models/Docs";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectToDatabase();

    try {
        // Authenticate the user
        const { user, error } = await authenticate(req);
        if (error) {
            return NextResponse.json({ error: error }, { status: 401 });
        }
        console.log("User ID:", user.sub);
        // Parse the request body
        const titles  = await req.json(); // Expecting an array of titles
        if(!titles){
            return NextResponse.json({ error: "No titles provided" }, { status: 400 });
        }
        console.log("Titles:", titles);
        if (!Array.isArray(titles) || titles.length === 0) {
            return NextResponse.json({ error: "Titles must be a non-empty array" }, { status: 400 });
        }

        // Fetch the authenticated user
        const authUser = await User.findOne({ supabaseId: user.sub });
        console.log("auth user from bulk blog", authUser);
        if (!authUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        

        // Process each title
        const results = await Promise.allSettled(
            titles.map(async (title) => {
                try {
                    const content = await generateBlog(title); // Generate content
                    const newDoc = await Docs.create({ userId: authUser._id, title, content }); // Create document
                    return { status: "fulfilled", value: newDoc };
                } catch (err) {
                    return { status: "rejected", reason: err.message };
                }
            })
        );

        // Separate successful and failed results
        const successful = results
            .filter((result) => result.status === "fulfilled")
            .map((result) => result.value);
        const failed = results
            .filter((result) => result.status === "rejected")
            .map((result) => result.reason);
        authUser.token -= successful.length; // Corrected variable name
        await authUser.save();
        // Return the results
        return NextResponse.json({ successful, failed }, { status: 207 }); // 207 Multi-Status
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
