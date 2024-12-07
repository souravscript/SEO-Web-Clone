import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req){
    await connectToDatabase();
    try{
        const {user,error}=await authenticate(req)
        //console.log("user is ",user)
        if(error){
            return NextResponse.json({error:"Error with the authentication",status:401})
        }
        const userFromDB=await User.findOne({_id:user.id})
        if(!userFromDB){
            NextResponse.json({message:"Error fetching user from the db"},{status:500})
        }
        console.log("user from db is",userFromDB)
        const coin=userFromDB.token
        console.log("coin is default", coin);

        return NextResponse.json({coin:coin},{status:200})
    }catch(err){
        NextResponse.json({message:err.message,status:501})
    }
}

export async function PUT(req){
    await connectToDatabase();
    try{
        const {user,error}=await authenticate()
        if(!user || error){
            NextResponse.json({message:"Error with the authentication"},{status:500})
        }
        
        const userFromDB=await findOne({_id:user.id})
        if(!userFromDB){
            NextResponse.json({message:"couldnot find user in the DB"},{status:404})          
        }

        const {expense}=req.json()
        if(!expense){
            NextResponse.json({message:"expense not recieved"},{status:400})
        }
        if(userFromDB.coin<expense){
            NextResponse.json({message:"Insufficient balance"},{status:400})
        }

        userFromDB.coin -= spentExpense;  // Deduct the spent amount
        await userFromDB.save();  // Save the updated user document

        return NextResponse.json({ coin: userFromDB.coin }, { status: 200 });
    }catch(err){
        NextResponse.json({message:err.message},{status:501})
    }
}