import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./../globals.css"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarNav } from "./components/sidebar-nav"

// Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })


export const metadata: Metadata = {
  title: "SUI Faucet Admin Dashboard",
  description: "Admin dashboard for managing SUI Testnet Faucet.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Temporary fallback: sidebar is closed by default in dev
  const defaultOpen = false

  return (
    <html lang="en" className={`${inter.variable} `}>
      <body className={`${inter.className}`}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className="flex min-h-screen w-full">
            <SidebarNav />
            <div className="flex flex-1 flex-col">
              <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-sui-ocean px-6 text-sui-cloud">
                <SidebarTrigger className="lg:hidden" />
                <h1 className="font-semibold text-lg md:text-xl">SUI Faucet Admin</h1>
              </header>
              {children}
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
