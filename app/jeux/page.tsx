"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JeuxPage() {
    const router = useRouter();
    useEffect(() => {
        router.push("/jeux/puzzle");
    }, []);
    return (
        null
    );
}