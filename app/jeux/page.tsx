"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";

export default function JeuxPage() {
    const router = useRouter();
    const { user, userData, loading } = useUser();
    useEffect(() => {
        if(!loading) {
            if(!user) {
                router.push("/login");
            }
        }
    }, [user, loading]);
    
    const backgroundStyle = userData?.map
      ? { backgroundImage: `${userData.map}` }
      : { backgroundColor: "#0B1C5A" };

    const avatarImage = userData?.avatar
      ? userData.avatar
      : "/medias/img/avatars/avatar1.png";

    return (
        <div
          className="relative flex flex-col justify-start items-center h-screen w-screen overflow-hidden text-white bg-cover bg-no-repeat bg-center"
        >
            <img src={backgroundStyle.backgroundImage ?? "/medias/img/maps/map1.png"} alt="Background" className="w-full h-full object-cover blur-[2px]" />
            <img src="/medias/img/logo-mirokai-exp-dark.png" alt="Logo" className="w-[120px] absolute top-6 left-1/2 transform -translate-x-1/2 translate-y-1/3" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[70vh] bg-black/50 border-2 border-blanc rounded-[20px]">
                <img src={userData?.level ?? "/medias/img/levels/level1.png"} alt="Level" className="w-full h-full object-cover" />
            </div>
            <img src={avatarImage} alt="Avatar" className="w-50 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3" />
        </div>
    );
}