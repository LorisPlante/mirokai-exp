"use client";

import Image from "next/image";
import { useI18n } from "@/locales/client";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Home() {
  const t = useI18n();

  return (
    <div className="flex w-full min-h-screen items-start justify-start font-sans">
      <main className="flex min-h-screen w-full flex-col items-center justify-start p-4">
        <div className="flex w-full items-center justify-between">
          <Image src="/medias/img/Logo-mirokai-exp-light.png" className="dark:hidden" alt="Mirokaï" width={150} height={100} />
          <Image src="/medias/img/Logo-mirokai-exp-dark.png" className="hidden dark:block" alt="Mirokaï" width={150} height={100} />
          <LanguageSwitcher />
        </div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight">
            {t("landing.title")}
          </h1>
          <p className="max-w-md text-lg leading-8">
            {t("landing.description")}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid px-5 transition-colors"
            href="/admin"
          >
            {t("landing.button")}
          </a>
        </div>
      </main>
    </div>
  );
}
