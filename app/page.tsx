"use client";

import Image from "next/image";
import { useI18n } from "@/locales/client";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/app/providers/ToastMessage";
import { useUser } from "@/app/providers/UserProvider";

export default function Home() {
  const t = useI18n();
  const { showToast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Adaptation de type pour pouvoir utiliser des clés d'erreur dynamiques sans erreur de typage
  const translate = t as (key: string) => string;

  const handleSubscribeNewsletter = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      const res = await fetch("/api/subscribe-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(translate(`errors.newsletter.${data.error ?? "error_unknown"}`),"error");
        setLoading(false);
        return;
      }
      else{
        setLoading(false);
        showToast(t("errors.newsletter.success"), "success");
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      showToast(t("errors.newsletter.error_network"), "error");
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen items-start justify-start font-sans">
      <main className="flex min-h-screen w-full flex-col items-center justify-start p-4">
        <div className="flex w-full items-center justify-between">
          <Image src="/medias/img/Logo-mirokai-exp-light.png" alt="Mirokaï" width={150} height={100} />
          <div className="flex gap-4 text-base font-medium">
            <Button
              onClick={() => router.push("/admin")}
            >
              {t("landing.button")}
            </Button>
            {user ? (
              <Button variant="secondary" onClick={() => router.push("/profile")}>
                {t("landing.profile")}
              </Button>
            ): (
            <Button variant="secondary" onClick={() => router.push("/login")}>
              {t("landing.login")}
            </Button>
            )}
          <LanguageSwitcher />
          </div>
        </div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight">
            {t("landing.title")}
          </h1>
          <p className="max-w-md text-lg leading-8">
            {t("landing.description")}
          </p>
        </div>
        <div className="w-full flex items-center justify-between gap-2 mt-20">
          <div className="flex flex-col items-start justify-start gap-2">
          <h2 className="text-2xl font-semibold">
            {t("landing.newsletter.title")}
          </h2>
          <p className="text-lg leading-8">
            {t("landing.newsletter.description")}
          </p>
          </div>
          
        <form onSubmit={(e) => handleSubscribeNewsletter(e)} className="flex gap-2">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="min-w-[250px] rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 ring-1 ring-zinc-500" required />
          <Button variant="secondary" type="submit" size="fit">
            {loading ? t("landing.newsletter.loading") : t("landing.newsletter.button")}
          </Button>
        </form>
        </div>
      </main>
    </div>
  );
}
