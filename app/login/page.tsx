"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/UI/Button";
import { useToast } from "@/app/providers/ToastMessage";
import { useUser } from "@/app/providers/UserProvider";

type Mode = "login" | "register";

const LoginPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { refreshUser } = useUser();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setusername("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          showToast(
            data.error === "email_already_used"
              ? "Cet email est déjà utilisé"
              : "Erreur lors de la création du compte",
            "error"
          );
          setLoading(false);
          return;
        }
        showToast("Compte créé, vous pouvez maintenant vous connecter", "success");
        setMode("login");
        setPassword("");
        setLoading(false);
        return;
      }

      // mode login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(
          data.error === "invalid_credentials"
            ? "Identifiants invalides"
            : "Erreur de connexion",
          "error"
        );
        setLoading(false);
        return;
      }

      showToast("Connexion réussie", "success");
      resetFields();
      setLoading(false);
      router.push("/");
      refreshUser();
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau", "error");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl p-8 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h1>
          <button
            type="button"
            className="text-sm underline"
            onClick={() =>
              setMode((prev) => (prev === "login" ? "register" : "login"))
            }
          >
            {mode === "login"
              ? "Pas encore de compte ? S'inscrire"
              : "Déjà un compte ? Se connecter"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div className="flex gap-2">
                
                <div className="flex-1">
                  <label className="block text-sm font-medium">Pseudo</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    className="mt-1 w-full rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 ring-1 ring-zinc-500"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 ring-1 ring-zinc-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 ring-1 ring-zinc-500"
              required
            />
          </div>

          <Button
            variant="primary"
            type="submit"
            size="full"
          >
            {loading
              ? mode === "login"
                ? "Connexion..."
                : "Création du compte..."
              : mode === "login"
              ? "Se connecter"
              : "Créer un compte"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;