import "../index.css";
import { headers } from "next/headers";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tawreed Platform — KSA",
  description: "Saudi contracting suppliers and procurement.",
  icons: { icon: "/favicon.svg" },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale =
    (await headers()).get("x-tawreed-locale") === "ar" ? "ar" : "en";
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
