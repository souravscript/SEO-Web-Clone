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

        if (blogRequests.length > 10) {
            return NextResponse.json({ 
                error: "Maximum 10 blogs can be generated at once" 
            }, { status: 400 });
        }

        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
        
        if (authUser.token < blogRequests.length) {
            return NextResponse.json({ 
                error: `Insufficient tokens. You need ${blogRequests.length} tokens but have only ${authUser.token} tokens.` 
            }, { status: 403 });
        }

        // Validate each request and check for duplicates
        const validationResults = await Promise.all(
            blogRequests.map(async (request) => {
                const { title } = request;
                
                if (!title) {
                    return { error: "Title is required", title };
                }

                // Check if a job is already processing for this title
                const existingStatus = await redisClient.get(`jobStatus:${authUser._id}:${title}`);
                if (existingStatus === "Processing") {
                    return { error: "Blog is already being processed", title };
                }

                return { title, valid: true };
            })
        );

        // Check for validation errors
        const errors = validationResults.filter(result => result.error);
        if (errors.length > 0) {
            return NextResponse.json({ 
                error: "Validation failed",
                details: errors
            }, { status: 400 });
        }

        // Add jobs to queue
        const jobs = await Promise.all(
            blogRequests.map(async (request) => {
                const { title, ...requestData } = request;

                // Store "Processing" status in Redis
                await redisClient.set(
                    `jobStatus:${authUser._id}:${title}`, 
                    "Processing", 
                    "EX", 
                    3600
                );

                // Add job to queue
                return await blogQueue.add(
                    "generateBlog", 
                    {
                        userId: authUser._id,
                        title,
                        requestData: { ...requestData, title }
                    }, 
                    {
                        removeOnComplete: true,
                        removeOnFail: 1000
                    }
                );
            })
        );

        // Deduct tokens
        authUser.token -= jobs.length;
        await authUser.save();

        return NextResponse.json({ 
            jobIds: jobs.map(job => job.id),
            message: `Processing ${jobs.length} blogs...`,
            status: "Processing",
            jobs: jobs.map(job => ({
                jobId: job.id,
                title: job.data.title
            }))
        }, { status: 202 });

    } catch (err) {
        console.error("Bulk blog generation error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// GET Route: Get status of bulk blog generation
export async function GET(req) {
    await connectToDatabase();

    try {
        const { user, error } = await authenticate(req);
        if (error) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get job IDs from query params
        const { searchParams } = new URL(req.url);
        const jobIds = searchParams.get('jobIds')?.split(',').filter(Boolean);

        if (!jobIds?.length) {
            return NextResponse.json({ error: "No job IDs provided" }, { status: 400 });
        }

        // Get status for each job
        const statuses = await Promise.all(
            jobIds.map(async (jobId) => {
                const result = await redisClient.get(`jobResult:${jobId}`);
                const error = await redisClient.get(`jobError:${jobId}`);
                
                if (error) {
                    return { jobId, status: "Failed", error };
                }
                
                if (result) {
                    return { 
                        jobId, 
                        status: "Completed",
                        data: JSON.parse(result)
                    };
                }
                
                return { jobId, status: "Processing" };
            })
        );

        return NextResponse.json({ 
            status: "success",
            jobs: statuses
        });

    } catch (err) {
        console.error("Error fetching bulk blog status:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}