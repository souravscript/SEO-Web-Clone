import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectToDatabase();
    try {
        const { user, error } = await authenticate(req);
        
        if (!user || error) {
            return NextResponse.json(
                { message: "Error with the authentication" }, 
                { status: 500 }
            );
        }

        const authUser = await User.findOne({ supabaseId: user.sub });

        if (!authUser) {
            return NextResponse.json(
                { message: "User not found" }, 
                { status: 404 }
            );
        }

        return NextResponse.json(
            { 
                token: authUser.token 
            }, 
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: err.message }, 
            { status: 501 }
        );
    }
}