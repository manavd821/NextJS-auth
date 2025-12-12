"use client";
import Link from "next/link";
import React from "react";
import { 
    useRouter, 
    useSearchParams,
} from "next/navigation";
import  axios from "axios";
import toast from "react-hot-toast";

export default function Login(){
    const router =useRouter();
    const searchParams = useSearchParams();
    const msg = searchParams.get("msg");
    console.log(msg)
    const [user, setUser]  = React.useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = React.useState(false);
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    async function onLogin(e : React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const loadingToaster = toast.loading("Waiting...");
        try {
            const response = await axios.post('/api/users/login/', user, {
                timeout : 8000 // 8 seconds
            });
            const {message} = response.data;
            console.log(response.data);
            toast.success(message);
            router.push('/profile');
        } catch (error : any) {
            console.log(`error in login:`);
            console.log(error.response.data.error);
            toast.error(`${error.response.data.error}`);
        } finally {
            setLoading(false);
            toast.dismiss(loadingToaster);
        }
    }
    function onChangeHandler(e : React.ChangeEvent<HTMLInputElement>){
        const { id, value }  = e.target;
        setUser({...user, [id] : value});
    }

    React.useEffect(() => {
            if(user.email.length > 0 && user.password.length > 0){
                setButtonDisabled(false);
            }
            else {
                setButtonDisabled(true);
            }
        }, [user]);

    React.useEffect(() => {
        if(msg === 'login-required') {
            toast.error("Please login to continue");
        }
        else if(msg === 'already-logged-in'){
            toast("You're already logged in");
        }
    },[msg]);
    
    return (
        <div 
        className="flex flex-col space-y-10 items-center justify-center min-h-screen py-2">
            <h1
            className="text-3xl"
            >{ loading ?'Processing' : 'Login Page'}</h1>
            <form 
            onSubmit={onLogin}
            className="border-2 rounded-2xl p-6 flex flex-col"
            >
                <div
                className="flex flex-col space-y-4"
                >
                    <label 
                    htmlFor="email"
                    className="block mb-2 font-bold text-lg"
                    >email</label>
                    <input 
                        type="email"
                        id="email"
                        placeholder="email"
                        onChange={onChangeHandler}
                        value={user.email}
                        className="border-2 mb-4 p-2 rounded-lg"
                        required
                    />
                </div>
                <div
                className="flex flex-col space-y-4"
                >
                    <label 
                    htmlFor="password"
                    className="block mb-2 font-bold text-lg"
                    >password</label>
                    <input 
                        type="password"
                        id="password"
                        placeholder="password"
                        onChange={onChangeHandler}
                        value={user.password}
                        className="border-2 mb-4 p-2 rounded-lg"
                        required
                    />
                </div>
                <button
                type="submit"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >{buttonDisabled ? 'No submit' :'Submit'}</button>
                <Link href={'/signup'}>Navigate to Signup</Link>
            </form>
        </div>
    )
}