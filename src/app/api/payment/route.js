// import connectToDatabase from "@/db/db-connect";
// import { authenticate } from "@/lib/authenticate";
// import { NextResponse } from "next/server";

// export async function PUT(req){
//     await connectToDatabase();
//     try{
//         const {user,error}=await authenticate()
//         if(!user || error){
//             NextResponse.json({message:"Error with the authentication"},{status:500})
//         }
        
//         const userFromDB=await findOne({_id:user.id})
//         if(!userFromDB){
//             NextResponse.json({message:"couldnot find user in the DB"},{status:404})          
//         }

//         const {rechargeAmount}=req.json()
//         if(!rechargeAmount){
//             NextResponse.json({message:"rechargeAmount not recieved"},{status:400})
//         }
//         if(userFromDB.coin<rechargeAmount){
//             NextResponse.json({message:"Insufficient balance"},{status:400})
//         }

//         userFromDB.coin += rechargeAmount;  // Add the recharge amount
//         await userFromDB.save();  // Save the updated user document

//         return NextResponse.json({ coin: userFromDB.coin }, { status: 200 });
//     }catch(err){
//         NextResponse.json({message:err.message},{status:501})
//     }
// }