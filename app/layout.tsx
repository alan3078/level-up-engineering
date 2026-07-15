import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/providers/query-provider";
import { LocaleProvider } from "@/lib/providers/locale-provider";

export const metadata: Metadata = {
  title: "豐進裝修工程有限公司 - 專業裝修服務",
  description:
    "豐進裝修工程有限公司 - 香港專業裝修公司，提供全屋裝修、室內設計、訂造傢俬等服務",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <body className="antialiased">
        <LocaleProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
