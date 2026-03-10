"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/UI/Button";
import { useToast } from "@/app/providers/ToastMessage";
import { useUser } from "@/app/providers/UserProvider";
import { useScopedI18n } from "@/locales/client";

type Mode = "login" | "register";

const LoginPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { refreshUser } = useUser();
  const t = useScopedI18n("auth");
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
              ? t("register.error_email_used")
              : t("register.error_generic"),
            "error"
          );
          setLoading(false);
          return;
        }
        showToast(t("register.success"), "success");
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
            ? t("login.error_invalid_credentials")
            : t("login.error_generic"),
          "error"
        );
        setLoading(false);
        return;
      }

      showToast(t("login.success"), "success");
      resetFields();
      setLoading(false);
      router.push("/");
      refreshUser();
    } catch (err) {
      console.error(err);
      showToast(t("login.error_network"), "error");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl p-8 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {mode === "login" ? t("login.title") : t("register.title")}
          </h1>
          <button
            type="button"
            className="text-sm underline cursor-pointer"
            onClick={() =>
              setMode((prev) => (prev === "login" ? "register" : "login"))
            }
          >
            {mode === "login"
              ? t("login.no_account")
              : t("login.already_account")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div className="flex gap-2">
                
                <div className="flex-1">
                  <label className="block text-base font-medium">
                    {t("register.username_label")}
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    className="mt-1 w-full rounded-md px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 ring-1 ring-zinc-500"
                    required
                  />
                </div>
              </div>
            </>
          )}

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

          <Button
            variant="primary"
            type="submit"
            size="full"
          >
            {loading
              ? mode === "login"
                ? t("login.loading")
                : t("register.loading")
              : mode === "login"
              ? t("login.submit")
              : t("register.submit")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;