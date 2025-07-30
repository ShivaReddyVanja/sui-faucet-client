import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import '@suiet/wallet-kit/style.css';
import TokenRefreshHandler from "@/components/TokenExpiryChecker";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons:"/sui.svg",
  title: "Sui testnet faucet",
  description: "Request sui testnet tokens, for developers, builders, community members.Most secure Ip gated and wallet based rate limiting.Testnet tokens for everyone.",
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

        <Toaster position="top-center" richColors />

        {children}
        <TokenRefreshHandler />
      </body>
    </html>
  );
}
