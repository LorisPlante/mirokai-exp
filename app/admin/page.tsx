"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminSession =
  | { authenticated: false }
  | {
      authenticated: true;
      user: { id: string; email: string; role: string };
    };

export default function AdminDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Tableau de bord admin
          </h1>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-100"
          >
            Se déconnecter
          </button>
        </div>
        <p className="mb-2 text-sm text-zinc-600">
          Connecté en tant que{" "}
          <span className="font-medium text-zinc-900">
            {email ?? "admin"}
          </span>
        </p>
        <p className="text-sm text-zinc-600">
          Ici, tu peux construire ton interface d’administration (gestion de
          contenu, utilisateurs, etc.).
        </p>
      </div>
    </div>
  );
}

