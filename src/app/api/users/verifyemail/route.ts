import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        console.log(reqBody)
        const {token} = reqBody;
        console.log(token);

        const user = await User.findOne({
            verifyToken : token,
            verifyTokenExpiry : {$gt : Date.now()},
        })
        if(!user){
            return NextResponse.json({error: "Invalid token"}, {status:400});
        }
        console.log(user);

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();
        
        return NextResponse.json({
            msg : 'Email verified', 
            success: true
        }, 
        {status:200});

    } catch (error) {
        console.log(error)
        return NextResponse.json({error}, {status : 500});
    }
}