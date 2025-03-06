import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navigation from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lista - Shopping List App",
  description: "A simple shopping list app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <Navigation />
          <main className="flex min-h-screen flex-col items-center p-4 sm:p-6">
            <div className="w-full max-w-4xl mx-auto">{children}</div>
          </main>
          <Toaster richColors position="top-center" />
        </AppProvider>
      </body>
    </html>
  );
}
