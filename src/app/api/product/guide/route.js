import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import Docs from "@/models/Docs";
import { NextResponse } from "next/server";

const DEFAULT_LLM = "openrouter";

export async function POST(req) {
    await connectToDatabase();

    try {
        const { user, error } = await authenticate(req);
        if (error) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, article_size, description } = await req.json();
        if (!title || !article_size || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (authUser.token < 1) {
            return NextResponse.json({ error: "Insufficient tokens" }, { status: 403 });
        }

        const response = await fetch('http://34.131.28.178:8080/api/guides/generate-guide-content/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                article_size,
                description,
                llm: DEFAULT_LLM,
                verbose: false
            }),
        });

        if (!response.ok) {
            let errorMessage = "Failed to generate guide content";
            try {
                const text = await response.text();
                // Try to parse as JSON first
                try {
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    // If not JSON, use the text as error message
                    errorMessage = text;
                }
            } catch (e) {
                console.error("Error reading response:", e);
            }
            return NextResponse.json({ error: errorMessage }, { status: response.status });
        }

        let data;
        try {
            const text = await response.text();
            data = JSON.parse(text);
        } catch (e) {
            console.error("Error parsing response:", e);
            return NextResponse.json({ error: "Invalid response from guide generation service" }, { status: 500 });
        }

        if (!data || !data.content) {
            return NextResponse.json({ error: "No content received from guide generation service" }, { status: 500 });
        }

        // Deduct token and save user
        authUser.token -= 1;
        await authUser.save();

        // Create new document
        const newDoc = await Docs.create({
            userId: authUser._id,
            title,
            content: data.content,
            docType: 'guide',
        });

        return NextResponse.json(newDoc, { status: 201 });

    } catch (err) {
        console.error("Error in POST route:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}