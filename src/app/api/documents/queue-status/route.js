// import { NextResponse } from "next/server";
// import { Queue } from "bullmq";
// import Redis from "ioredis";

// // Initialize Redis and Queue
// const redisClient = new Redis();
// const blogQueue = new Queue("blogQueue", { connection: redisClient });

// export async function GET(req) {
//     try {
//         // Get queue status
//         const jobs = await blogQueue.getWaiting(); // Jobs waiting in queue
//         return NextResponse.json({ queueLength: jobs.length, jobs }, { status: 200 });
//     } catch (err) {
//         return NextResponse.json({ error: err.message }, { status: 500 });
//     }
// }

import { NextResponse } from "next/server";
import { blogQueue } from "@/lib/blogWorker";

// // Initialize Redis and Queue
// const redisClient = new Redis();
// const blogQueue = new Queue("blogQueue", { connection: redisClient });


export async function GET(req) {
    try {
        const [waiting, active, failed, completed] = await Promise.all([
            blogQueue.getWaiting(),    // Jobs waiting in queue
            blogQueue.getActive(),     // Jobs currently running
            blogQueue.getFailed(),     // Failed jobs
            blogQueue.getCompleted(),  // Successfully completed jobs
        ]);

        return NextResponse.json({
            waitingCount: waiting.length,
            activeCount: active.length,
            failedCount: failed.length,
            completedCount: completed.length,
            waiting,
            active,
            failed,
            completed
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
