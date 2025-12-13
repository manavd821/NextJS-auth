import { 
    NextRequest,
    NextResponse,
} from "next/server";

export function proxy(request: NextRequest){
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/login' || path === '/signup' || path == '/verifyemail';
    const token = request.cookies.get("token") || '';
    

    if(isPublicPath && token){
        const url = new URL('/profile', request.nextUrl);
        url.searchParams.set("msg", "already-logged-in");
        return NextResponse.redirect(url);
    }
    if(!isPublicPath && !token){
        const url = new URL('/login', request.nextUrl);
        url.searchParams.set("msg", "login-required");
        return NextResponse.redirect(url);
    }
    return NextResponse.next()
}

export const config = {
    matcher : [
        '/',
        '/login',
        '/signup',
        '/profile',
        '/verifyemail',
    ]
}
