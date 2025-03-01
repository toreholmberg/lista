import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { List } from "lucide-react"
import { AppProvider } from "@/context/AppContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lista - Shopping List App",
  description: "A simple shopping list app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <nav className="bg-primary text-primary-foreground">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="font-bold text-xl flex items-center">
                    <List className="h-6 w-6 mr-2" />
                    Lista
                  </Link>
                </div>
                <div className="flex">
                  <Link
                    href="/"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary"
                  >
                    Lists
                  </Link>
                  <Link
                    href="/items"
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary"
                  >
                    Items
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="flex min-h-screen flex-col items-center p-4 sm:p-6">
            <div className="w-full max-w-4xl mx-auto">{children}</div>
          </main>
        </AppProvider>
      </body>
    </html>
  )
}

