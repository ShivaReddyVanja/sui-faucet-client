"use client"
import { Suspense } from "react";
import Component from "./HomePage";
import SuiLoader from "@/components/SuiLoader";
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import TokenRefreshHandler from "@/components/TokenExpiryChecker";
export default function Home() {
  return (
    <div className="font-sans">
      <WalletProvider>
        <Suspense fallback={<SuiLoader />}>
          <Component />
        </Suspense>
         <TokenRefreshHandler />
      </WalletProvider>
    </div>
  );
}
