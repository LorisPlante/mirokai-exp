"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import Button from "@/components/UI/Button";
import { useToast } from "@/app/providers/ToastMessage";

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useScopedI18n("admin");

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/admin/session", { cache: "no-store" });
      if (!res.ok) {
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data.authenticated) router.push("/admin");
    };
    checkSession();
  }, [router]);

  // On évite les types d'événements React dépréciés ici pour supprimer les warnings
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Erreur de connexion", "error");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau", "error");
        setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-xl p-8 shadow">
        <h1 className="mb-6 text-xl font-semibold">
          {t("login_title")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-base font-medium">
              {t("login.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 ring-1 ring-zinc-500"
              required
            />
          </div>
          <div>
            <label className="block text-base font-medium">
              {t("login.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 ring-1 ring-zinc-500"
              required
            />
          </div>
          <Button variant="secondary" type="submit" size="full">
            {loading ? t("login.loading") : t("login.button")}
          </Button>
        </form>
      </div>
    </div>
  );
}

