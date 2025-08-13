import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
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
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkEnabled = Boolean(
    publishableKey && publishableKey !== "pk_test_dummy"
  );

  const MaybeClerk: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    clerkEnabled ? <ClerkProvider>{children}</ClerkProvider> : <>{children}</>;

  return (
    <MaybeClerk>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="w-full border-b border-black/10 dark:border-white/10">
            <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
              <Link href="/" className="font-semibold">
                Talent.krd
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/sign-in">Sign in</Link>
                <Link href="/sign-up">Sign up</Link>
              </div>
            </nav>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </MaybeClerk>
  );
}
