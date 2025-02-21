import { NextResponse } from "next/server";
import { authenticate } from "@/lib/authenticate";
import connectToDatabase from "@/db/db-connect";
import Docs from "@/models/Docs";
import User from "@/models/User";
import { extractTitleFromContent } from "@/lib/extractTitle";

export async function POST(req) {
    try {
        // Connect to database
        await connectToDatabase();

        // Authenticate the request
        const { user, error: authError } = await authenticate(req);
        
        if (authError) {
            return NextResponse.json(
                { error: "Authentication failed" }, 
                { status: 401 }
            );
        }

        // Find authenticated user
        const authUser = await User.findOneAndUpdate(
            { supabaseId: user.sub },
            { $inc: { tokens: -1 } }, // Decrement tokens by 1
            { new: true } // Return the updated document
        );

        if (!authUser) {
            return NextResponse.json(
                { message: "User not found" }, 
                { status: 404 }
            );
        }

        // Check if user has sufficient tokens
        // if (authUser.tokens < 0) {
        //     // Rollback token decrement
        //     await User.findOneAndUpdate(
        //         { supabaseId: user.sub },
        //         { $inc: { tokens: 1 } }
        //     );

        //     return NextResponse.json(
        //         { error: "Insufficient tokens to save review" }, 
        //         { status: 403 }
        //     );
        // }

        // Parse request body
        const { content } = await req.json();
        const title = await extractTitleFromContent(content)
        // Validate input
        if (!content) {
            return NextResponse.json(
                { error: "Review content is required" }, 
                { status: 400 }
            );
        }

        // Create new review document
        const newDoc = await Docs.create({
            userId: authUser._id,
            docType: 'review',
            title: title,
            content: content,
        });

        // Return success response
        return NextResponse.json(
            { 
                message: "Review saved successfully", 
                review: newDoc,
                remainingTokens: authUser.tokens
            }, 
            { status: 201 }
        );

    } catch (error) {
        console.error("Review Saving Error:", error);
        return NextResponse.json(
            { 
                error: "Internal server error during review saving",
                details: error.message 
            }, 
            { status: 500 }
        );
    }
}