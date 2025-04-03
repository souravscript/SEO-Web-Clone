// import connectToDatabase from "@/db/db-connect";
// //import Doc from "@/models/Doc";
// import { NextResponse } from "next/server";
// import Docs from "@/models/Docs";
// import { authenticate } from "@/lib/authenticate";
// import User from "@/models/User";
// import { generateBlog } from "@/lib/generateBlog";
// import { Queue, Worker } from "bullmq";
// import Redis from "ioredis";


// const redisClient = new Redis();

// // Create a BullMQ queue
// export const blogQueue = new Queue("blogQueue", { connection: redisClient });

// export async function POST(req) {
//     await connectToDatabase();

//     // Authenticate the user
//     try {
//         //console.log("This is the request", req.cookies['access_token'])
//         const { user, error } = await authenticate(req);
//         if (error) {
//             return NextResponse.json({ "Error message": error }, { status: 401 });
//         }

//         const { reqJSONdata } = await req.json()
//         const { title } = reqJSONdata;
//         console.log("Headers ", req.headers)
//         console.log("req json data", reqJSONdata)
//         // Parse the request body
//         // const { title } = await req.json();
//         // if (!title) {
//         //     return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
//         // }
//         // const content=await generateBlog(title)
//         //console.log("User ID:", user._id);
//         const hostedMLService = process.env.HOSTED_ML_SERVICE;
//         console.log("ML Service", hostedMLService)
//         //const localMLService = "http://localhost:8080/api/layouts/generate-content";
//         const content = await fetch(hostedMLService, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 //Authorization: `Bearer ${access_token}`,
//             },
//             //credentials: 'include',
//             body: JSON.stringify(reqJSONdata),
//         });
//         const responseBody = await content.json();

//         console.log("Response body:", responseBody);

//         console.log("Content in singe blog api", content)

//         // Create a new Document associated with the user
//         const authUser = await User.findOne({ supabaseId: user.sub })
//         console.log("authUser ", authUser)

//         // Check if user has sufficient tokens
//         if (authUser.token < 1) {
//             return NextResponse.json({ error: "Insufficient balance. Please add more tokens to continue." }, { status: 403 });
//         }

//         //console.log("auth user", authUser)
//         //console.log("This is supabase user",user)
//         //console.log("This is mongo user ", JSON.stringify(authUser))
//         //const Documents = await Docs.findOne({ userId:authUser.id });
//         const newDoc = await Docs.create({ userId: authUser._id, title, content: responseBody.content, docType: 'blog' });
//         if (newDoc) {
//             console.log(newDoc)
//             authUser.token -= 1;
//             await authUser.save();
//         }

//         return NextResponse.json(newDoc, { status: 201 });
//     } catch (err) {
//         return NextResponse.json({ error: err.message }, { status: 500 });

//     }
// }



// export async function GET(req) {
//     await connectToDatabase();

//     try {
//         // Authenticate the user
//         const { user, error } = await authenticate(req);
//         if (error) {
//             return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
//         }

//         //console.log("Authenticated Supabase user ID:", user);

//         // Find the authenticated user in MongoDB
//         const authUser = await User.findOne({ supabaseId: user.sub });
//         if (!authUser) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         // Fetch documents associated with the authenticated user
//         const documents = await Docs.find({ userId: authUser._id }).sort({ createdAt: -1 });

//         //console.log("MongoDB User:", JSON.stringify(authUser));
//         //console.log("User Documents:", documents);

//         // Return documents in the response
//         return NextResponse.json({ documents }, { status: 200 });
//     } catch (err) {
//         console.error("Error fetching documents:", err);
//         return NextResponse.json({ error: err.message }, { status: 500 });
//     }
// }


import connectToDatabase from "@/db/db-connect";
import { NextResponse } from "next/server";
import Docs from "@/models/Docs";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import { Queue, Worker, Job } from "bullmq";
import Redis from "ioredis";

// Initialize Redis Client
const redisClient = new Redis({
    maxRetriesPerRequest: null  // This is the critical missing configuration
  });

// Create a BullMQ queue
export const blogQueue = new Queue("blogQueue", { connection: redisClient });

// 🔹 Worker to process jobs asynchronously
new Worker(
  "blogQueue",
  async (job) => {
    await connectToDatabase();

    const { userId, title, requestData } = job.data;
    const authUser = await User.findById(userId);
    
    if (!authUser || authUser.token < 1) {
      await redisClient.set(`jobError:${job.id}`, "Insufficient balance.", "EX", 3600);
      return;
    }

    // Fetch AI-generated content
    const hostedMLService = process.env.HOSTED_ML_SERVICE;
    const contentRes = await fetch(hostedMLService, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const responseBody = await contentRes.json();

    // Store in MongoDB
    const newDoc = await Docs.create({ 
      userId: authUser._id, 
      title, 
      content: responseBody.content, 
      docType: 'blog' 
    });

    if (newDoc) {
      authUser.token -= 1;
      await authUser.save();
    }

    // Store job result in Redis (expires in 1 hour)
    await redisClient.set(`jobResult:${job.id}`, JSON.stringify(newDoc), "EX", 3600);
  },
  { connection: redisClient }
);

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