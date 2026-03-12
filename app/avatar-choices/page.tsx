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
            return;
        }
        // Si le profil est déjà complet, on envoie directement vers les jeux
        if (user.username && user.avatar && user.map) {
            router.push("/jeux");
        }
    }, [user, loading, router]);
    
    return (
        <AvatarChoices />
    );
};

export default AvatarChoicesPage;