import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import { generateBlog } from "@/lib/generateBlog";
import Docs from "@/models/Docs";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectToDatabase();

    // Authenticate the user
    try {
        //console.log("This is the request", req.cookies['access_token'])
        const { user, error } = await authenticate(req);
        if (error) {
            return NextResponse.json({ "Error message": error }, { status: 401 });
        }

        const reqJSONdata = await req.json()
        const hostedMLService = "http://34.131.28.178:8080/api/layouts/generate-bulk-content"
        const content = await fetch(hostedMLService, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(reqJSONdata),
        });
        const responseBody = await content.json();

        console.log("Response body:", responseBody);

        // Create a new Document associated with the user
        const authUser = await User.findOne({ supabaseId: user.sub })

        // const newDoc = await Docs.create({ userId: authUser._id, title, content: responseBody.content, docType: 'blog' });
        // if (newDoc) {
        //     console.log(newDoc)
        //     authUser.token -= 1;
        //     await authUser.save();
        // }

        return NextResponse.json(responseBody, { status: 201 });
    } catch (err) {
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

        // Find the authenticated user in MongoDB
        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch bulk blog documents associated with the authenticated user
        const documents = await Docs.find({
            userId: authUser._id,
            docType: 'bulk-blog'
        }).sort({ createdAt: -1 });

        // Return documents in the response
        return NextResponse.json({ documents }, { status: 200 });
    } catch (err) {
        console.error("Error fetching documents:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
