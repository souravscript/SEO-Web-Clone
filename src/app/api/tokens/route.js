import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectToDatabase();
    try {
        const { user, error } = await authenticate(req);
        
        if (error) {
            return NextResponse.json(
                { error: "Error with the authentication" }, 
                { status: 401 }
            );
        }
        
        const userFromDB = await User.findOne({ _id: user.id });
        
        if (!userFromDB) {
            return NextResponse.json(
                { message: "Error fetching user from the db" }, 
                { status: 500 }
            );
        }
        
        const coin = userFromDB.token;
        console.log("coin is default", coin);

        return NextResponse.json(
            { coin: coin }, 
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: err.message }, 
            { status: 501 }
        );
    }
}

export async function PUT(req) {
    await connectToDatabase();
    try {
        const { user, error } = await authenticate(req);
        
        if (!user || error) {
            return NextResponse.json(
                { message: "Error with the authentication" }, 
                { status: 500 }
            );
        }
        
        const userFromDB = await User.findOne({ _id: user.id });
        
        if (!userFromDB) {
            return NextResponse.json(
                { message: "Could not find user in the DB" }, 
                { status: 404 }
            );          
        }

        const { expense } = await req.json();
        
        if (!expense) {
            return NextResponse.json(
                { message: "Expense not received" }, 
                { status: 400 }
            );
        }
        
        if (userFromDB.coin < expense) {
            return NextResponse.json(
                { message: "Insufficient balance" }, 
                { status: 400 }
            );
        }

        userFromDB.coin -= expense;  // Corrected variable name
        await userFromDB.save();  

        return NextResponse.json(
            { coin: userFromDB.coin }, 
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: err.message }, 
            { status: 501 }
        );
    }
}