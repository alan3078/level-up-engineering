import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/navigation/main-nav";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "豐進裝修工程有限公司 - 專業裝修服務",
  description: "豐進裝修工程有限公司 - 香港專業裝修公司，提供全屋裝修、室內設計、訂造傢俬等服務",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MainNav />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
