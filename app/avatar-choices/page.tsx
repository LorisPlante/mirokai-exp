"use client";
import AvatarChoices from "@/components/AvatarChoices";
import { useUser } from "@/app/providers/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AvatarChoicesPage = () => {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if(loading) {
            return;
        }
        if(!user) {
            router.push("/login");
        }
    }, [user, router]);
    
    return (
        <AvatarChoices />
    );
};

export default AvatarChoicesPage;