"use client";

import { I18nProviderClient } from "@/locales/client";
import { ToastProvider } from "./ToastMessage";
import ToastMessage from "@/components/UI/ToastMessage";
import ChatBot from "@/components/ChatBot";
import { UserProvider } from "./UserProvider";

type Props = {
  locale: string;
  children: React.ReactNode;
};

export function I18nAppProvider({ locale, children }: Props) {
  return <I18nProviderClient locale={locale}>
    <UserProvider>
      <ToastProvider>
        {children}
        <ToastMessage />
        <ChatBot />
      </ToastProvider>
    </UserProvider>
    </I18nProviderClient>;
}

