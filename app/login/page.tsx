"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/UI/Button";
import { useToast } from "@/app/providers/ToastMessage";
import { useUser } from "@/app/providers/UserProvider";
import { useScopedI18n } from "@/locales/client";
import Link from "next/link";
import Image from "next/image";

type Mode = "login" | "register";

const LoginPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { refreshUser, user, loading } = useUser();
  const t = useScopedI18n("auth");
  const [mode, setMode] = useState<Mode>("login");
  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  

  const resetFields = () => {
    setusername("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoadingLogin(true);

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
          setLoadingLogin(false);
          return;
        }
        showToast(t("register.success"), "success");
        setMode("login");
        setPassword("");
        setLoadingLogin(false);
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
        setLoadingLogin(false);
        return;
      }

      showToast(t("login.success"), "success");
      resetFields();
      setLoadingLogin(false);
      refreshUser();
      setTimeout(() => {
        if(!loading) {
          if(user){
        if(user?.username && user?.avatar && user?.map) {
          router.push("/jeux");
          } else {
            router.push("/avatar-choices");
          }
        }
        }
      }, 0);
    } catch (err) {
      console.error(err);
      showToast(t("login.error_network"), "error");
      setLoadingLogin(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0B1C5A]">
    <div className="flex flex-col min-h-screen items-center justify-start text-white bg-[url('/medias/img/Etoiles1.png')] bg-cover bg-no-repeat bg-center">
      <div className="w-full h-[158px] sticky top-0 left-0 right-0 flex items-center justify-center">
        <Image src="/medias/img/Logo-mirokai-exp-dark.png" alt="Mirokaï" width={150} height={100} />
      </div>
      <div className="w-full max-w-md rounded-xl p-8 mt-10">
        <div className="mb-6 flex-col items-center justify-between">
          <h1 className="text-xl font-semibold">
            {mode === "login" ? t("login.title") : t("register.title")}
          </h1>
          <p className="text-sm">
            {mode === "login" ? t("login.description") : t("register.description")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-b border-white relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer/email mt-1 w-full rounded-md p-2 text-base outline-none ring-none focus:outline-none focus:ring-none"
              required
            />
            <label htmlFor="email" className={`${email ? 'hidden' : 'block'} absolute top-1/2 left-0 transform -translate-y-1/2 block text-xl font-medium peer-focus/email:hidden peer-active/email:hidden peer-filled/email:hidden peer-valid/email:hidden peer-visited/email:hidden`}>
              {t("login.email")}
            </label>
          </div>
          <div className="border-b border-white relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer/password mt-1 w-full rounded-md p-2 text-base outline-none ring-none focus:outline-none focus:ring-none"
              required
            />
            <label htmlFor="password" className={`${password ? 'hidden' : 'block'} absolute top-1/2 left-0 transform -translate-y-1/2 block text-xl font-medium peer-focus/password:hidden peer-active/password:hidden peer-filled/password:hidden peer-valid/password:hidden peer-visited/password:hidden`}>
              {t("login.password")}
            </label>
            {/* Show password toggle */}
            <button type="button" className="absolute top-1/2 right-0 transform -translate-y-1/2 text-xl font-medium cursor-pointer h-8 w-8 flex items-center justify-center" onClick={() => setShowPassword(!showPassword)}>
            {!showPassword ? (
            <svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.25 9.6C11.2755 9.6 14.0145 7.9125 15.486 5.25C14.0145 2.5875 11.2755 0.9 8.25 0.9C5.2245 0.9 2.4855 2.5875 1.014 5.25C2.4855 7.9125 5.2245 9.6 8.25 9.6ZM8.25 0C11.856 0 14.979 2.136 16.5 5.25C14.979 8.364 11.856 10.5 8.25 10.5C4.644 10.5 1.521 8.364 0 5.25C1.521 2.136 4.644 0 8.25 0ZM8.25 7.35C8.80695 7.35 9.3411 7.12875 9.73492 6.73492C10.1288 6.3411 10.35 5.80695 10.35 5.25C10.35 4.69305 10.1288 4.1589 9.73492 3.76508C9.3411 3.37125 8.80695 3.15 8.25 3.15C7.69305 3.15 7.1589 3.37125 6.76508 3.76508C6.37125 4.1589 6.15 4.69305 6.15 5.25C6.15 5.80695 6.37125 6.3411 6.76508 6.73492C7.1589 7.12875 7.69305 7.35 8.25 7.35ZM8.25 8.25C7.45435 8.25 6.69129 7.93393 6.12868 7.37132C5.56607 6.80871 5.25 6.04565 5.25 5.25C5.25 4.45435 5.56607 3.69129 6.12868 3.12868C6.69129 2.56607 7.45435 2.25 8.25 2.25C9.04565 2.25 9.80871 2.56607 10.3713 3.12868C10.9339 3.69129 11.25 4.45435 11.25 5.25C11.25 6.04565 10.9339 6.80871 10.3713 7.37132C9.80871 7.93393 9.04565 8.25 8.25 8.25Z" fill="white"/>
            </svg>
            ) : (
              <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.25 11.2658C11.2755 11.2658 14.0145 9.57827 15.486 6.91577C14.0145 4.25327 11.2755 2.56577 8.25 2.56577C5.2245 2.56577 2.4855 4.25327 1.014 6.91577C2.4855 9.57827 5.2245 11.2658 8.25 11.2658ZM8.25 1.66577C11.856 1.66577 14.979 3.80177 16.5 6.91577C14.979 10.0298 11.856 12.1658 8.25 12.1658C4.644 12.1658 1.521 10.0298 0 6.91577C1.521 3.80177 4.644 1.66577 8.25 1.66577ZM8.25 9.01577C8.80695 9.01577 9.3411 8.79452 9.73492 8.4007C10.1288 8.00687 10.35 7.47273 10.35 6.91577C10.35 6.35882 10.1288 5.82467 9.73492 5.43085C9.3411 5.03702 8.80695 4.81577 8.25 4.81577C7.69305 4.81577 7.1589 5.03702 6.76508 5.43085C6.37125 5.82467 6.15 6.35882 6.15 6.91577C6.15 7.47273 6.37125 8.00687 6.76508 8.4007C7.1589 8.79452 7.69305 9.01577 8.25 9.01577ZM8.25 9.91577C7.45435 9.91577 6.69129 9.5997 6.12868 9.03709C5.56607 8.47448 5.25 7.71142 5.25 6.91577C5.25 6.12012 5.56607 5.35706 6.12868 4.79445C6.69129 4.23184 7.45435 3.91577 8.25 3.91577C9.04565 3.91577 9.80871 4.23184 10.3713 4.79445C10.9339 5.35706 11.25 6.12012 11.25 6.91577C11.25 7.71142 10.9339 8.47448 10.3713 9.03709C9.80871 9.5997 9.04565 9.91577 8.25 9.91577Z" fill="white"/>
                <line x1="2.91575" y1="13.7137" x2="13.2979" y2="0.50002" stroke="white" strokeLinecap="round"/>
              </svg>

            )}
            </button>
          </div>
          {mode === "login" && (
            <Link className="text-sm underline cursor-pointer mb-4 block" href="/forgot-password">Forgot password?</Link>
          )}

          <Button
            variant="secondary"
            type="submit"
            size="full"
          >
            {loadingLogin
              ? mode === "login"
                ? t("login.loading")
                : t("register.loading")
              : mode === "login"
              ? t("login.submit")
              : t("register.submit")}
          </Button>
          {mode === "login" && (
            <Button
              variant="white"
              type="submit"
              size="full"
            >
              <img src="/medias/img/google_icon.png" alt="Google" width={20} height={20} className="mr-2" />
              <span className="text-foreground">
                Se connecter avec Google
              </span>
            </Button>
          )}
        </form>
        <button
            type="button"
            className="text-sm underline cursor-pointer text-center w-full block mt-10"
            onClick={() =>
              setMode((prev) => (prev === "login" ? "register" : "login"))
            }
          >
            {mode === "login"
              ? t("login.no_account")
              : t("login.already_account")}
          </button>
          {mode === "register" && (
            <Image src="/medias/img/Etoiles.png" alt="Etoiles" width={600} height={100} className="w-[200px] h-auto mx-auto mt-10"/>
          )}
          {mode === "login" && (
            <Image src="/medias/img/rune.png" alt="Rune" width={600} height={100} className="w-[148px] h-auto mx-auto mt-10"/>
          )}
      </div>
    </div>
    </div>
  );
};

export default LoginPage;