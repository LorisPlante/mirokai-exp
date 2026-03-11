"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import Button from "@/components/UI/Button";

type AdminSession =
  | { authenticated: false }
  | {
      authenticated: true;
      user: { id: string; email: string; role: string };
    };

export default function AdminDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const t = useScopedI18n("admin");

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" });
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }
        const data: AdminSession = await res.json();
        if (!data.authenticated) {
          router.push("/admin/login");
          return;
        }
        setEmail(data.user.email);
      } catch {
        router.push("/admin/login");
      }
    }
    loadSession();
  }, [router]);

  async function logout() {
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
    } finally {
      router.push("/admin/login");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-2xl rounded-xl p-8 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {t("title")}
          </h1>
            <Button
              onClick={logout}
              variant="secondary"
            >
              {t("logout")}
            </Button>
        </div>
        <p className="mb-2 text-sm">
          {t("connected_as")} {" "}
          <span className="font-medium">
            {email ?? "admin"}
          </span>
        </p>
        <p className="text-sm">
          {t("description")}
        </p>
        <div className="flex flex-row gap-2 pt-4">
          <Button variant="secondary" onClick={() => router.push("/admin/plan")}>
            {t("plan_management")}
          </Button>
        </div>
      </div>
    </div>
  );
}

