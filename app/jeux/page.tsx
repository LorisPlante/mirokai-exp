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
            console.log("userData", userData);
            console.log("user", user);
        }
    }, [user, loading]);
    
    const backgroundStyle = userData?.map
      ? { backgroundImage: `url(${userData.map})` }
      : { backgroundColor: "#0B1C5A" };

    return (
        <div
          className="relative flex flex-col justify-start items-center h-screen w-screen overflow-hidden text-white bg-cover bg-no-repeat bg-center"
          style={backgroundStyle}
        >
            <h1>Jeux</h1>
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                    <h2>Jeu {index + 1}</h2>
                </div>
            ))}
        </div>
    );
}