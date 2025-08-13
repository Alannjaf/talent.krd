import type { Metadata } from "next";
import { StackProvider, StackTheme, UserButton } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import React from "react";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MouseTrail from "./components/MouseTrail";

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
            <MouseTrail />
            <header className="w-full backdrop-blur-md bg-gray-900/80 border-b border-gray-700/50 sticky top-0 z-50">
              <nav className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
                <Link
                  href="/"
                  className="font-bold text-xl gradient-text hover:scale-105 transition-transform"
                >
                  Talent.krd
                </Link>
                <div className="flex items-center gap-8 text-sm">
                  <Link
                    href="/talents"
                    className="hover:text-indigo-400 transition-colors font-medium relative group"
                  >
                    Browse Talents
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="hover:text-indigo-400 transition-colors font-medium relative group"
                  >
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
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
