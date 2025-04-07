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
      url: process.env.REDIS_URL,
      maxRetriesPerRequest: null
    });
  }
  return _redisClient;
}

// Function to get or create the blog queue
export function getBlogQueue() {
  if (!_blogQueue) {
    _blogQueue = new Queue("blogQueue", { 
      connection: getRedisClient() 
    });
  }
  return _blogQueue;
}

// Function to initialize the worker (only on server, only once)
export function initBlogWorker() {
  // Only create worker in server environment and if it doesn't already exist
  if (typeof window === 'undefined' && !_blogWorker) {
    _blogWorker = new Worker(
      "blogQueue",
      async (job) => {
        await connectToDatabase();

        const { userId, title, requestData } = job.data;
        const authUser = await User.findById(userId);
        
        if (!authUser || authUser.token < 1) {
          await getRedisClient().set(`jobError:${job.id}`, "Insufficient balance.", "EX", 3600);
          return;
        }

        try {
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
          await getRedisClient().set(`jobResult:${job.id}`, JSON.stringify(newDoc), "EX", 3600);
          await getRedisClient().set(`jobStatus:${authUser._id}:${title}`, "Completed", "EX", 3600);

          return { success: true, docId: newDoc._id };
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error);
          
          // Store error message
          await getRedisClient().set(
            `jobError:${job.id}`,
            error.message || 'Unknown error',
            "EX",
            3600
          );
          
          await getRedisClient().set(
            `jobStatus:${authUser._id}:${title}`,
            "Failed",
            "EX",
            3600
          );
          
          throw error;
        }
      },
      { 
        connection: getRedisClient(),
        concurrency: 5,
        removeOnComplete: true,
        removeOnFail: 1000,
      }
    );

    // Log worker initialization
    console.log('Blog worker initialized');

    // Add event handlers
    _blogWorker.on('completed', job => {
      console.log(`Job ${job.id} completed successfully`);
    });

    _blogWorker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed with error ${err.message}`);
    });
  }
  
  return _blogWorker;
}

// Initialize the worker when this module is imported (server-side only)
if (typeof window === 'undefined') {
  initBlogWorker();
}

// Export convenience accessors
export const redisClient = getRedisClient();
export const blogQueue = getBlogQueue();
export const blogWorker = _blogWorker;