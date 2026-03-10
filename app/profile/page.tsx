"use client";
import { useUser } from "@/app/providers/UserProvider";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/providers/ToastMessage";

const ProfilePage = () => {
    const { user, refreshUser } = useUser();
    const router = useRouter();
    const { showToast } = useToast();
    if (!user) {
        return <div>You are not logged in</div>;
    }
    const handleLogout = async () => {
        const res = await fetch("/api/auth/logout", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
            router.push("/");
            refreshUser();
        } else {
            showToast("Error logging out", "error");
        }
    };
    return (
        <div>
            <h1>Profile</h1>
            <Button variant="secondary" onClick={() => handleLogout()}>Logout</Button>
        </div>
    );
};

export default ProfilePage;