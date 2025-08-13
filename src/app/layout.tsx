import type { Metadata } from "next";
import { StackProvider, StackTheme, UserButton } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import React from "react";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Talent Platform",
  description: "Showcase unique talents and connect with customers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <header className="w-full border-b border-black/10 dark:border-white/10">
              <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
                <Link href="/" className="font-semibold text-lg">
                  Talent.krd
                </Link>
                <div className="flex items-center gap-6 text-sm">
                  <Link href="/talents" className="hover:text-blue-600 transition-colors">
                    Browse Talents
                  </Link>
                  <Link href="/dashboard/profile" className="hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <UserButton />
                </div>
              </nav>
            </header>
            <main>{children}</main>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
