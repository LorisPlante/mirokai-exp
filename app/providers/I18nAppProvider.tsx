"use client";

import { I18nProviderClient } from "@/locales/client";

type Props = {
  locale: string;
  children: React.ReactNode;
};

export function I18nAppProvider({ locale, children }: Props) {
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
}

