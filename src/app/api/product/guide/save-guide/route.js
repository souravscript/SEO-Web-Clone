import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import Docs from "@/models/Docs";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectToDatabase();

    try {
        const { user, error } = await authenticate(req);
        if (error) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, content } = await req.json();
        if (!content || !title) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Create new document
        const newDoc = await Docs.create({
            userId: authUser._id,
            title,
            content,
            docType: 'guide',
        });

        return NextResponse.json(newDoc, { status: 201 });

    } catch (err) {
        console.error("Error in save guide route:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
