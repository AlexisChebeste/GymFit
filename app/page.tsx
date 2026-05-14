"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/AuthContext";

export default function RootPage() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.push("/dashboard");
            } else {
                router.push("/auth/login");
            }
        }
    }, [user, loading, router]);

    return (
        <div className="h-screen bg-natural flex items-center justify-center">
            <p className="text-primary animate-pulse italic font-bold text-2xl">CARGANDO...</p>
        </div>
    );
}