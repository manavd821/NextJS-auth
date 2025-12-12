"use client";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Data = {
    id : string, 
    username : string, 
    email : string,
}

export default function Profile(){
    const initialState = {
        id: "",
        username: "",
        email: "",
    }
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState<Data>(initialState);

    const router = useRouter();
    async function logoutHandler() {
        setLoading(true);
        const loadingToast = toast.loading("Waiting...")
        try {
            const response = await axios.get('/api/users/logout/');
            console.log(response.data);
            toast.success(response.data.message);
            router.push('/login')
        } catch (error : any) {
            const errMsg = error.response.data
            console.log(errMsg.error);
            toast.error(errMsg.error);
            if(errMsg.alreadyLoggedOut) router.push('/login');
        } finally {
            setLoading(false);
            toast.dismiss(loadingToast);
        }

    }
    async function getUserData() {
        setLoading(true);
        const loadingToast = toast.loading("Waiting...");
        try {
            const response = await axios.get('/api/users/me');
            const {_id, email, username} = response.data.user;
            setData({
                id : _id,
                email,
                username,
            });
            toast.success("Data retrieved successfully!");
        } catch (error : any) {
            const errMsg = error.response.data.error
            toast.error(errMsg);
            console.log(error);
            setData(initialState);
        } finally {
            setLoading(false);
            toast.dismiss(loadingToast);
        }
    }
    return (
        <div className="">
            <h1>Profile</h1>
            <hr />
            <p>profile page</p>
            <hr />
            <button
            className="bg-blue-400 hover:bg-blue-600 p-2"
            onClick={logoutHandler}
            >
                {loading ? 'Processing' :'Logout'}
            </button>
            <hr />
            <hr />
            <button
            className="bg-blue-400 hover:bg-blue-600 p-2 m-3"
            onClick={getUserData}
            >
                {loading ? 'Processing' :'GetData'}
            </button>
            {data.id ? (
                <div>
                    <span>{data.username} : {data.email}</span>
                </div>
            ) : (
                <div>Nothing Here</div>
            )}
        </div>
    )
}