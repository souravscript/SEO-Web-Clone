

import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import { blogQueue, redisClient } from "@/lib/blogWorker";
import User from "@/models/User";
import { NextResponse } from "next/server";


// 🔹 POST Route: Add Multiple Blog Generation Jobs
export async function POST(req) {
    await connectToDatabase();

    try {
        const { user, error } = await authenticate(req);
        if (error) return NextResponse.json({ error }, { status: 401 });

        const { blogRequests } = await req.json();
        
        // Validate input
        if (!Array.isArray(blogRequests) || blogRequests.length === 0) {
            return NextResponse.json({ 
                error: "Invalid request: blogRequests must be a non-empty array" 
            }, { status: 400 });
        }

        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Check if user has enough tokens
        if (authUser.token < blogRequests.length) {
            return NextResponse.json({ 
                error: `Insufficient balance. You need ${blogRequests.length} tokens but have only ${authUser.token} tokens.` 
            }, { status: 403 });
        }

        // Process each blog request and add to queue
        const jobs = await Promise.all(blogRequests.map(async (request) => {
            const { title, ...requestData } = request;
            
            if (!title) {
                return null; // Skip invalid entries
            }

            // Store "Processing" status in Redis
            await redisClient.set(`jobStatus:${authUser._id}:${title}`, "Processing", "EX", 3600);

            // Add job to queue
            return await blogQueue.add("generateBlog", {
                userId: authUser._id,
                title,
                requestData: { ...requestData, title },
            });
        }));

        // Filter out null entries and get valid jobs
        const validJobs = jobs.filter(Boolean);

        // Deduct tokens upfront
        authUser.token -= validJobs.length;
        await authUser.save();

        return NextResponse.json({ 
            message: `Added ${validJobs.length} blog generation jobs to queue`,
            jobs: validJobs.map(job => ({
                jobId: job.id,
                title: job.data.title
            }))
        }, { status: 202 });

    } catch (err) {
        console.error("Bulk blog generation error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}