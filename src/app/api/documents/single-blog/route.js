

import connectToDatabase from "@/db/db-connect";
import { NextResponse } from "next/server";
import Docs from "@/models/Docs";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import { blogQueue, redisClient } from "@/lib/blogWorker";



// 🔹 Worker to process jobs asynchronously
// new Worker(
//   "blogQueue",
//   async (job) => {
//     await connectToDatabase();

//     const { userId, title, requestData } = job.data;
//     const authUser = await User.findById(userId);
    
//     if (!authUser || authUser.token < 1) {
//       await redisClient.set(`jobError:${job.id}`, "Insufficient balance.", "EX", 3600);
//       return;
//     }

//     // Fetch AI-generated content
//     const hostedMLService = process.env.HOSTED_ML_SERVICE;
//     const contentRes = await fetch(hostedMLService, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestData),
//     });

//     const responseBody = await contentRes.json();

//     // Store in MongoDB
//     const newDoc = await Docs.create({ 
//       userId: authUser._id, 
//       title, 
//       content: responseBody.content, 
//       docType: 'blog' 
//     });

//     if (newDoc) {
//       authUser.token -= 1;
//       await authUser.save();
//     }

//     // Store job result in Redis (expires in 1 hour)
//     await redisClient.set(`jobResult:${job.id}`, JSON.stringify(newDoc), "EX", 3600);
//   },
//   { connection: redisClient }
// );

// 🔹 POST Route: Add Blog Generation Job
export async function POST(req) {
    await connectToDatabase();

    try {
        const { user, error } = await authenticate(req);
        if (error) return NextResponse.json({ error }, { status: 401 });

        const { reqJSONdata } = await req.json();
        const { title } = reqJSONdata;

        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Store "Processing" status in Redis
        await redisClient.set(`jobStatus:${authUser._id}:${title}`, "Processing", "EX", 3600);

        // Add job to queue
        const job = await blogQueue.add("generateBlog", {
            userId: authUser._id,
            title,
            requestData: reqJSONdata,
        });

        return NextResponse.json({ jobId: job.id, message: "Processing your blog..." }, { status: 202 });
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