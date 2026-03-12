import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { I18nAppProvider } from "@/app/providers/I18nAppProvider";

export const viewport = { themeColor: "#20328E" };

export const metadata: Metadata = {
  title: "Mirokaï Exp",
  description: "Mirokaï Expérience",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "fr";

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/png" href="/medias/img/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/medias/img/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/medias/img/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/medias/img/favicon/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Mirokaï" />
        <link rel="manifest" href="/medias/img/favicon/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#20328E" />
        <meta name="theme-color" content="#20328E" />
      </head>
      <body>
        <I18nAppProvider locale={locale}>{children}</I18nAppProvider>
      </body>
    </html>
  );
}
