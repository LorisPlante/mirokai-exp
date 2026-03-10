"use client";
import { useUser } from "@/app/providers/UserProvider";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/providers/ToastMessage";
import { useScopedI18n } from "@/locales/client";

const ProfilePage = () => {
    const { user, refreshUser } = useUser();
    const router = useRouter();
    const { showToast } = useToast();
    const t = useScopedI18n("auth");
    if (!user) {
        return <div>{t("profile.not_logged_in")}</div>;
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
            showToast(t("profile.error_logout"), "error");
        }
    };
    return (
        <div>
            <h1>{t("profile.title")}</h1>
            <Button variant="secondary" onClick={() => handleLogout()}>
              {t("profile.logout")}
            </Button>
        </div>
    );
};

export default ProfilePage;