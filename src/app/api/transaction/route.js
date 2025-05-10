// import { authenticate } from "@/lib/authenticate";
// import Transaction from "@/models/Transaction";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function POST(req,res){
//     await connectToDatabase();
//     try{
//         const {user,error}=await authenticate(req);
//         if(error){
//             return NextResponse.json({error:"Unauthorized access"},{status:401});
//         }
//         const {amount,type}=await req.json();
//         if(!amount||!type){
//             return NextResponse.json({error:"Missing required fields"},{status:400});
//         }
//         const authUser=await User.findOne({supabaseId:user.sub});
//         if(!authUser){
//             return NextResponse.json({error:"User not found"},{status:404});
//         }
//         const transaction=new Transaction({
//             userId:authUser._id,
//             amount,
//             type,
//             createdAt:new Date()
//         });
//         await transaction.save();
//         return NextResponse.json({message:"Transaction successful"},{status:200});
//     }catch(err){
//         console.error("Error in transaction route:",err);
//         return NextResponse.json({error:err.message},{status:500});
//     }
// }

// export async function GET(req,res){
//     await connectToDatabase();
//     try{
//         const {user,error}=await authenticate(req);
//         if(error){
//             return NextResponse.json({error:"Unauthorized access"},{status:401});
//         }
//         const authUser=await User.findOne({supabaseId:user.sub});
//         if(!authUser){
//             return NextResponse.json({error:"User not found"},{status:404});
//         }
//         const transactions=await Transaction.find({userId:authUser._id}).sort({createdAt:-1});
//         return NextResponse.json({transactions},{status:200});
//     }catch(err){
//         console.error("Error in transaction route:",err);
//         return NextResponse.json({error:err.message},{status:500});
//     }
// }
