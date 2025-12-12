import bcrypt from "bcryptjs";
import connect from "@/dbConfig/dbConfig";
import User from "@/models/usermodel";
import {
    NextRequest,
    NextResponse,
} from 'next/server';
import jwt from 'jsonwebtoken';

connect()

type UserData = {
    email : string,
    password : string,
}

export async function POST(request : NextRequest){
    try {
        const { email, password } : UserData = await request.json();

        if(email.length <=0 )
            return NextResponse.json({'error' : 'Please provide email'}, {status : 4000});

        const user = await User.findOne({email});
        if(!user) {
            return NextResponse.json({'error' : 'user not found'}, {status : 400});
        }
        const { 
            _id : id,
            password : dbHashPassword, 
            email : dbEmail, 
            username: dbUsername, 
        } = user; 
        // console.log(user);
        const check = await bcrypt.compare(password, dbHashPassword);
        // console.log(check)
        if(!check){
            return NextResponse.json({error : 'Invalid Password'}, {status : 400});
        }

        // create token data
        const tokenData = {
            id,
            username : dbUsername,
            email,
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
            expiresIn : "1d",
        });
        
        const response = NextResponse.json({'message' : 'Successfully Login' , success : true});
        response.cookies.set(
            "token", token, {
                httpOnly: true,
            }
        )
        return response
    } catch (error) {
        console.log("Error in login: ", error);
        return NextResponse.json({error}, {status : 500});
    }
}