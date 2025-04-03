import connectToDatabase from "@/db/db-connect";
import User from "@/models/User";
import { Transaction } from "@/models/Transaction";
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/authenticate";

export async function GET(req) {
    await connectToDatabase();
    try {
        const { user, error } = await authenticate(req);
        if (error) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }
        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const transaction = await Transaction.findOne({ _id: req.params.transactionId });
        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }
        return NextResponse.json({ transaction }, { status: 200 });
    } catch (err) {
        console.error("Error fetching transaction:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}