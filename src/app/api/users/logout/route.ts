import {
    NextRequest,
    NextResponse,
} from 'next/server';


export async function GET(request : NextRequest) {
    try {
        
        const response = NextResponse.json({
            'message': 'Logout Successful',
            'success' : true,
        });
        if(!request.cookies.has("token")){
            return NextResponse.json({
                'error' : 'You are already LoggedOut!',
                alreadyLoggedOut : true,
            }, {status : 400});
        }
        response.cookies.delete("token");
        return response;
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}