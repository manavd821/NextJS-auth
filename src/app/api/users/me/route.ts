import { 
    NextRequest,
    NextResponse, 
} from "next/server";
import getDataFromToken from "@/helpers/getDataFromToken";
import User from "@/models/usermodel";

export async function GET(request : NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        // console.log(user);
        if(!userId) return NextResponse.json({"error" : 'Token not found'}, {status : 400});
        const user = await User.findOne({_id : userId}).select("-password");
        if(!user){
            return NextResponse.json({'message' : 'User Not found'}, {status : 400});
        }
        return NextResponse.json({message : 'User found', user}, {status : 200});
    } catch (error : any) {
        console.log(error.message);
        return NextResponse.json({error}, {status : 500});
    }
}