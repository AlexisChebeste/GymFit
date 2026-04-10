"use client"

import { useState } from "react";


export default function RegisterPage() {

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    function handleRegister() {
        // supabase.auth.signUp
    }
    

    return (
        <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Register Page</h1>
        </div>
    );
}