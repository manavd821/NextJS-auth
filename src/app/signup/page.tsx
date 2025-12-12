"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function SignUp(){
    const searchParams = useSearchParams();
    const msg = searchParams.get("msg");
    console.log(msg)
    const router = useRouter();
    const [user, setUser]  = React.useState({
        username: "",
        email: "",
        password: "",
    });
    const {username, email, password} = user;
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    async function onSignUp(e : React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        const toastLoading = toast.loading("Loading...");
        try {
            setLoading(true);
            const response = await axios.post('/api/users/signup/', user, {
                timeout : 8000 // 8 seconds
            });
            console.log(response.data)
            toast.success(`${response.data.message}`);
            
            router.push('/login');
        } catch (error : any) {
            toast.error(error.response.data.error)
            console.log("Error: ", error.response.data.error);
        } finally {
            setLoading(false);
            toast.dismiss(toastLoading);
        }
    }
    function onChangeHandler(e : React.ChangeEvent<HTMLInputElement>){
        const { id, value }  = e.target;
        setUser({...user, [id] : value});
    }
    const notify = () => {
        console.log("hi")
        toast("Here is your toast")
    }
    React.useEffect(() => {
        if(username.length > 0 && email.length > 0 && password.length > 0){
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
            toast.success("You're already logged in");
        }
    },[msg]);
    
    return (
        <div 
        className="flex flex-col space-y-10 items-center justify-center min-h-screen py-2">
            
            <h1
            className="text-3xl"
            >{loading ? 'Processing' : 'SignUp'}</h1>
            <form 
            onSubmit={onSignUp}
            className="border-2 rounded-2xl p-6 flex flex-col"
            >
                <div
                className="flex flex-col space-y-4"
                >
                    <label 
                    htmlFor="username"
                    className="block mb-2 font-bold text-lg"
                    >username</label>
                    <input 
                        type="text"
                        id="username"
                        placeholder="username"
                        onChange={onChangeHandler}
                        value={user.username}
                        className="border-2 mb-4 p-2 rounded-lg"
                        required
                    />
                </div>
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
                className={`bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600
                    ${buttonDisabled ? 'hover:cursor-not-allowed' : ''}`}
                >{buttonDisabled ? "No signup" : "signup"}</button>
                <Link href={'/login'}>Navigate to Login</Link>
            </form>
            <button onClick={notify}>Toast</button>
        </div>
    )
}