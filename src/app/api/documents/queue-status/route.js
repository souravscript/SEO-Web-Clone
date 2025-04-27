import { NextResponse } from "next/server";
import { blogQueue, redisClient } from "@/lib/blogWorker";

export async function GET(req) {
    try {
        console.log("Fetching queue status...");
        
        // Get jobs from queue
        const [waiting, active, failed, completed] = await Promise.all([
            blogQueue.getWaiting(),
            blogQueue.getActive(),
            blogQueue.getFailed(),
            blogQueue.getCompleted()
        ]);

        // Process jobs to include their results/errors from Redis
        const processedCompleted = await Promise.all(
            (completed || []).map(async (job) => {
                const result = await redisClient.get(`jobResult:${job.id}`);
                return {
                    ...job,
                    result: result ? JSON.parse(result) : null
                };
            })
        );

        const processedFailed = await Promise.all(
            (failed || []).map(async (job) => {
                const error = await redisClient.get(`jobError:${job.id}`);
                return {
                    ...job,
                    error: error || job.failedReason
                };
            })
        );

        const queueStatus = {
            waitingCount: waiting.length,
            activeCount: active.length,
            failedCount: failed.length,
            completedCount: completed.length,
            waiting: waiting.map(job => ({
                id: job.id,
                timestamp: job.timestamp,
                data: job.data
            })),
            active: active.map(job => ({
                id: job.id,
                timestamp: job.timestamp,
                data: job.data,
                progress: job.progress
            })),
            failed: processedFailed.map(job => ({
                id: job.id,
                timestamp: job.timestamp,
                data: job.data,
                error: job.error
            })),
            completed: processedCompleted.map(job => ({
                id: job.id,
                timestamp: job.timestamp,
                data: job.data,
                result: job.result
            }))
        };

        console.log("Queue status counts:", {
            waitingCount: queueStatus.waitingCount,
            activeCount: queueStatus.activeCount,
            failedCount: queueStatus.failedCount,
            completedCount: queueStatus.completedCount
        });

        return NextResponse.json(queueStatus, { status: 200 });
    } catch (err) {
        console.error("Error fetching queue status:", err);
        return NextResponse.json({ 
            error: "Failed to fetch queue status",
            details: err.message 
        }, { status: 500 });
    }
}
