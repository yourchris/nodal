import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SyncProvider } from "@/components/SyncProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NODAL - Zero Typing Ledger",
  description: "Aplikasi pencatatan keuangan personal Zero Typing & Offline-first.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-[#030712] flex items-center justify-center p-0 md:p-4">
        {/* Centered Mobile viewport mock for premium experience */}
        <div className="w-full max-w-md min-h-screen md:min-h-[850px] md:max-h-[900px] md:rounded-3xl md:border md:border-slate-800 md:shadow-2xl overflow-hidden bg-obsidian flex flex-col relative">
          <SyncProvider>
            {children}
          </SyncProvider>
        </div>
      </body>
    </html>
  );
}
