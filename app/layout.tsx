import type { Metadata } from "next";
import "./globals.css";
import "./desktop.css";
import "./mobile.css";

export const metadata: Metadata = {
  title: "به‌جا | راهنمای انتخاب کافه در تهران",
  description: "کافه‌ای برای کار، قرار یا دورهمی پیدا کن. به‌جا، راهنمای انتخاب کافه‌های تهران.",
  icons: {
    icon: "/images/brand.png",
    shortcut: "/images/brand.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
