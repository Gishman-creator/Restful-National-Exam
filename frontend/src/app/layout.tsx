import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fire Extinguisher Management System",
  description: "Manage, inspect, and maintain fire safety equipment.",
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-[#F8F9FB] text-slate-900">
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
