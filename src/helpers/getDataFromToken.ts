import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'

export default async function getDataFromToken(request:NextRequest) {
    try {
        const token = request.cookies.get("token")?.value || '';
        if(!token){
            return '';
        };
        const decodedToken : any = jwt.verify(token, process.env.TOKEN_SECRET!);
        return decodedToken.id || '';
    } catch (error : any) {
        throw new Error(error.message);
    }
}