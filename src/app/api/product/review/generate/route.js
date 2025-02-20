import { NextResponse } from "next/server";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import connectToDatabase from "@/db/db-connect";

export async function POST(req) {

    await connectToDatabase();

    try {
        // Authenticate the request
        const { user, error: authError } = await authenticate(req);
        
        if (authError) {
            console.error("Authentication Error:", authError);
            return NextResponse.json(
                { error: "Authentication failed" }, 
                { status: 401 }
            );
        }

        // Find authenticated user
        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) {
            console.error("User not found for Supabase ID:", user.sub);
            return NextResponse.json(
                { message: "User not found" }, 
                { status: 404 }
            );
        }

        // Parse request body
        const { product_url, llm } = await req.json();

        // Validate input
        if (!product_url) {
            console.error("Missing product URL in request");
            return NextResponse.json(
                { error: "Product URL is required" }, 
                { status: 400 }
            );
        }

        // Call external ML service for technical review
        console.log("Calling external ML service with URL:", product_url);
        
        let responseData;
        try {
            const response = await fetch("http://34.131.28.178:8080/api/products/generate-technical-review/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    product_url, 
                    llm: llm || "openrouter" 
                }),
                // Add timeout to prevent hanging
                signal: AbortSignal.timeout(30000) // 30 seconds timeout
            });

            // Check if the external service call was successful
            if (!response.ok) {
                const errorText = await response.text();
                console.error("ML Service Error Response:", errorText);
                return NextResponse.json(
                    { 
                        error: "Failed to generate review", 
                        details: errorText 
                    }, 
                    { status: 500 }
                );
            }

            // Parse the response from the ML service
            responseData = await response.json();
            console.log("ML Service Response:", responseData);

        } catch (fetchError) {
            console.error("External Service Fetch Error:", fetchError);
            return NextResponse.json(
                { 
                    error: "Error calling review generation service",
                    details: fetchError.message 
                }, 
                { status: 500 }
            );
        }

        // Return the generated review
        return NextResponse.json(
            { 
                technical_review: responseData?.technical_review || "No review generated",
                source: "ML Service"
            }, 
            { status: 200 }
        );

    } catch (error) {
        console.error("Review Generation Error:", error);
        return NextResponse.json(
            { 
                error: "Internal server error during review generation",
                details: error.message 
            }, 
            { status: 500 }
        );
    }
}