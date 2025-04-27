// import { Queue, Worker } from "bullmq";
// import connectToDatabase from "@/db/db-connect";
// import User from "@/models/User";
// import Docs from "@/models/Docs";
// import Redis from "ioredis";

// // Initialize Redis Client
// export const redisClient = new Redis({
//   maxRetriesPerRequest: null  // This is the critical missing configuration
// });

// // Create a BullMQ queue
// export const blogQueue = new Queue("blogQueue", { connection: redisClient });

// // 🔹 Worker to process jobs asynchronously
// export const blogWorker = new Worker(
//   "blogQueue",
//   async (job) => {
//     await connectToDatabase();

//     const { userId, title, requestData } = job.data;
//     const authUser = await User.findById(userId);
    
//     if (!authUser || authUser.token < 1) {
//       await redisClient.set(`jobError:${job.id}`, "Insufficient balance.", "EX", 3600);
//       return;
//     }

//     try {
//       // Fetch AI-generated content
//       const hostedMLService = process.env.HOSTED_ML_SERVICE;
//       const contentRes = await fetch(hostedMLService, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestData),
//       });

//       if (!contentRes.ok) {
//         throw new Error(`ML service error: ${contentRes.statusText}`);
//       }

//       const responseBody = await contentRes.json();

//       // Store in MongoDB
//       const newDoc = await Docs.create({ 
//         userId: authUser._id, 
//         title, 
//         content: responseBody.content, 
//         docType: 'blog' 
//       });

//       if (newDoc) {
//         authUser.token -= 1;
//         await authUser.save();
//       }

//       // Store job result in Redis (expires in 1 hour)
//       await redisClient.set(`jobResult:${job.id}`, JSON.stringify(newDoc), "EX", 3600);
//       await redisClient.set(`jobStatus:${authUser._id}:${title}`, "Completed", "EX", 3600);

//       return { success: true, docId: newDoc._id };
//     } catch (error) {
//       console.error(`Job ${job.id} failed:`, error);
      
//       // Store error message
//       await redisClient.set(
//         `jobError:${job.id}`,
//         error.message || 'Unknown error',
//         "EX",
//         3600
//       );
      
//       await redisClient.set(
//         `jobStatus:${authUser._id}:${title}`,
//         "Failed",
//         "EX",
//         3600
//       );
      
//       throw error;
//     }
//   },
//   { 
//     connection: redisClient,
//     concurrency: 5, // Process 5 jobs at a time
//     removeOnComplete: true,
//     removeOnFail: 1000,
//   }
// );



// lib/queue.js
import { Queue, Worker } from "bullmq";
import connectToDatabase from "@/db/db-connect";
import User from "@/models/User";
import Docs from "@/models/Docs";
import Redis from "ioredis";

// Global variables to hold the Redis client, queue, and worker instances
let _redisClient;
let _blogQueue;
let _blogWorker;

// Function to get or create the Redis client
export function getRedisClient() {
  if (!_redisClient) {
    _redisClient = new Redis({
      maxRetriesPerRequest: null,
      enableReadyCheck: true
    });
  }
  return _redisClient;
}

// Function to get or create the blog queue
export function getBlogQueue() {
  if (!_blogQueue) {
    _blogQueue = new Queue("blogQueue", {
      connection: getRedisClient(),
      defaultJobOptions: {
        removeOnComplete: {
          age: 24 * 3600, // Keep completed jobs for 24 hours
          count: 1000 // Keep last 1000 completed jobs
        },
        removeOnFail: {
          age: 24 * 3600, // Keep failed jobs for 24 hours
          count: 1000 // Keep last 1000 failed jobs
        }
      }
    });
  }
  return _blogQueue;
}

// Function to initialize the worker (only on server, only once)
export function initBlogWorker() {
  if (!_blogWorker) {
    _blogWorker = new Worker(
      "blogQueue",
      async (job) => {
        await connectToDatabase();

        const { userId, title, requestData } = job.data;
        const authUser = await User.findById(userId);
        
        if (!authUser || authUser.token < 1) {
          const error = "Insufficient balance.";
          await getRedisClient().set(`jobError:${job.id}`, error, "EX", 24 * 3600);
          throw new Error(error);
        }

        try {
          // Update job progress
          await job.updateProgress(10);

          // Fetch AI-generated content
          const hostedMLService = process.env.HOSTED_ML_SERVICE;
          const contentRes = await fetch(hostedMLService, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
          });

          if (!contentRes.ok) {
            throw new Error(`ML service error: ${contentRes.statusText}`);
          }

          await job.updateProgress(50);

          const responseBody = await contentRes.json();

          // Store in MongoDB
          const newDoc = await Docs.create({ 
            userId: authUser._id, 
            title, 
            content: responseBody.content, 
            docType: 'blog' 
          });

          await job.updateProgress(80);

          if (newDoc) {
            authUser.token -= 1;
            await authUser.save();
          }

          // Store job result in Redis (expires in 24 hours)
          const result = {
            docId: newDoc._id,
            title: newDoc.title,
            createdAt: newDoc.createdAt,
            status: 'completed'
          };

          await getRedisClient().set(
            `jobResult:${job.id}`,
            JSON.stringify(result),
            "EX",
            24 * 3600
          );

          await getRedisClient().set(
            `jobStatus:${authUser._id}:${title}`,
            "Completed",
            "EX",
            24 * 3600
          );

          await job.updateProgress(100);

          return result;

        } catch (error) {
          console.error(`Job ${job.id} failed:`, error);
          
          // Store error message
          await getRedisClient().set(
            `jobError:${job.id}`,
            error.message || 'Unknown error',
            "EX",
            24 * 3600
          );
          
          await getRedisClient().set(
            `jobStatus:${authUser._id}:${title}`,
            "Failed",
            "EX",
            24 * 3600
          );
          
          throw error;
        }
      },
      { 
        connection: getRedisClient(),
        concurrency: 5,
        lockDuration: 30000, // 30 seconds lock
        lockRenewTime: 15000 // Renew lock every 15 seconds
      }
    );

    // Handle worker events
    _blogWorker.on('completed', async (job) => {
      console.log(`Job ${job.id} completed successfully`);
    });

    _blogWorker.on('failed', async (job, err) => {
      console.error(`Job ${job.id} failed:`, err);
    });

    _blogWorker.on('error', err => {
      console.error('Worker error:', err);
    });
  }
  return _blogWorker;
}

// Initialize Redis client and queue
export const redisClient = getRedisClient();
export const blogQueue = getBlogQueue();

// Initialize the worker when this module is imported (server-side only)
if (typeof window === 'undefined') {
  initBlogWorker();
}