import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import LightRays from "@/components/LightRays";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "חיהLES - סטודיו ליצירת מותגים",
  description: "מיתוג, אתרים ומודעות. נראות שמעלה עסקים רמה.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LightRays />
        <Header />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
