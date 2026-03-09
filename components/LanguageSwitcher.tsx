"use client";

import { useEffect, useState } from "react";

const SUPPORTED_LOCALES = ["fr", "en"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )locale=([^;]+)/);
    if (match && SUPPORTED_LOCALES.includes(match[1] as Locale)) {
      setLocale(match[1] as Locale);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value as Locale;
    document.cookie = `locale=${newLocale}; path=/; max-age=${
      60 * 60 * 24 * 365
    }`;
    setLocale(newLocale);
    // On recharge pour que le layout serveur lise le nouveau cookie
    window.location.reload();
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="rounded-md border border-solid px-2 py-1 text-md"
    >
      <option value="fr">🇫🇷</option>
      <option value="en">🇬🇧</option>
    </select>
  );
}

