import { 
    NextRequest,
    NextResponse,
} from "next/server";
import connect from "@/dbConfig/dbConfig";
import User from "@/models/usermodel";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

type userData = {
    username : string,
    email : string,
    password : string,
}

connect()

export async function POST(request : NextRequest){
    try {
        const reqBody : userData = await request.json();
        // console.log(reqBody)
        const {username, email, password} = reqBody;

        // validate data
        if(!username.length || !email.length || !password.length){
            return NextResponse.json({"error" : "Empty field not allowed"}, {"status" : 400});
        }
        // check for email

        // check if email exist
        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({"error" : "User already exist"}, {"status" : 400});
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password.trim(), salt);

        const newUser = new User({
            username : username.trim(),
            email : email.trim(),
            password : hashPassword,
        });
        const savedUser = await newUser.save();
        console.log(savedUser);

        // send verification email
        await sendEmail({
            email,
            emailType : "VERIFY",
            userId : savedUser._id, 
        })
        return NextResponse.json({"message" : "User created successfully"}, {status : 201})


    } catch (error) {
        return NextResponse.json({error : error}, {status : 500})
    }
}