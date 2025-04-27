import connectToDatabase from "@/db/db-connect";
import { NextResponse } from "next/server";
import Docs from "@/models/Docs";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import { blogQueue, redisClient } from "@/lib/blogWorker";

// 🔹 POST Route: Add Blog Generation Job
export async function POST(req) {
    await connectToDatabase();

    try {
        const { user, error } = await authenticate(req);
        if (error) return NextResponse.json({ error }, { status: 401 });

        const { reqJSONdata } = await req.json();
        console.log("Request JSON Data:", reqJSONdata);
        const { title } = reqJSONdata;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Store "Processing" status in Redis
        await redisClient.set(`jobStatus:${authUser._id}:${title}`, "Processing", "EX", 3600);
        const jobStatus = await redisClient.get(`jobStatus:${authUser._id}:${title}`);
        console.log("Processing status set in Redis", jobStatus);

        // Add job to queue
        const job = await blogQueue.add("generateBlog", {
            userId: authUser._id,
            title,
            requestData: reqJSONdata,
        }, {
            removeOnComplete: true,
            removeOnFail: 1000
        });

        console.log("Blog generation job added to queue", job);

        return NextResponse.json({ jobId: job.id, message: "Processing your blog..." }, { status: 202 });
    } catch (err) {
        console.error("Blog generation error:", err);
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

        //console.log("Authenticated Supabase user ID:", user);

        // Find the authenticated user in MongoDB
        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch documents associated with the authenticated user
        const documents = await Docs.find({ userId: authUser._id }).sort({ createdAt: -1 });

        //console.log("MongoDB User:", JSON.stringify(authUser));
        //console.log("User Documents:", documents);

        // Return documents in the response
        return NextResponse.json({ documents }, { status: 200 });
    } catch (err) {
        console.error("Error fetching documents:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}