"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function VerifyEmailPage(){
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    async function verifyEmail() {
        try {
            const response = await axios.post('/api/users/verifyemail', {token});
            setVerified(true);
            console.log(response.data);
        } catch (error : any) {
            setError(true);
            console.log(error.response.data);
        }
    }
    useEffect(() => {
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || '');
    }, [])
    useEffect(() => {
        if(token.length > 0){
            ;(async () =>{
                await verifyEmail();
            })()
        }
    }, [token])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl">Verify Email</h1>
            <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : 'No token'}</h2>
            {
                verified && (
                    <div>
                        <h2>Email verified successfully</h2>
                        <Link href="/login">
                            <p className="text-blue-400">Login</p>
                        </Link>
                    </div>
                )
            }
            {
                error && (
                    <div>
                        <h2 className="bg-red-500 text-2xl text-black">Error</h2>
                        
                    </div>
                )
            }
        </div>
    )
}
