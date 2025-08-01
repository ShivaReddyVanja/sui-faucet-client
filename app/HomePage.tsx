"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  Wallet,
  Copy,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { FaucetResponse, Config } from "@/lib/types";
import { requestFaucet } from "@/services/requestFaucet";
import { getFaucetConfig } from "@/services/config";
import { toast } from "sonner";
import { FaucetModal } from "@/components/FaucetModal";
import { useSearchParams } from "next/navigation";
import ConnectButton from "@/components/ConnectButton";
import { useWallet } from "@suiet/wallet-kit";
import Image from "next/image";
import Link from "next/link";
import { BsDot } from "react-icons/bs";

export default function Component() {
  const searchParams = useSearchParams();
  const { account } = useWallet();


  const [walletAddress, setWalletAddress] = useState("");
  const [response, setResponse] = useState<FaucetResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaimSuccess, setIsClaimSuccess] = useState(false);
  const [tx, setTx] = useState<string | undefined>(undefined);
  const [nextClaimTimestamp, setNextClaimTimestamp] = useState<number | null>(null);
  const [config, setConfig] = useState<Config>();

  const isValidSuiAddress = (address: string) => /^0x[a-fA-F0-9]{64}$/.test(address);
  const isValidAddress = walletAddress.length > 0 && walletAddress.startsWith("0x");

  // Sync wallet address from wallet-kit
  useEffect(() => {
    setWalletAddress(account?.address || "");
  }, [account?.address]);

  // Prefill wallet from query param
  useEffect(() => {
    const param = searchParams.get("address");
    if (param) setWalletAddress(param);
  }, [searchParams]);

  // Fetch config
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await getFaucetConfig();
        setConfig(res.config);
      } catch (err) {
        console.error("Error fetching config:", err);
      }
    }
    fetchConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    if (!isValidSuiAddress(walletAddress)) {
      setResponse({ error: "Invalid Sui wallet address", status: "error" });
      setLoading(false);
      return;
    }

    const result = await requestFaucet(walletAddress);
    setResponse(result);

    if (result.status === "success") {
      toast.success(result.message);
      setIsClaimSuccess(true);
      setTx(result.tx);
      setNextClaimTimestamp(86400);
      setIsModalOpen(true);
    } else if (result.status === "error" && result.nextClaimTimestamp) {
      setIsClaimSuccess(false);
      setNextClaimTimestamp(result.nextClaimTimestamp);
      setIsModalOpen(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#EFF6FF_0%,_#ECFEFF_50%,_#F0FDFA_100%)] font-['Inter_Tight'] h-full">
      <div className="relative z-10 container mx-auto px-4 py-12 h-full flex-1">
           <div className="absolute inset-0 bg-[url('/Vector.png')] bg-cover bg-center opacity-6 max-w-2xl min-h-full mx-auto -rotate-3 "></div>
      <div className="">
  
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="font-['Inter_Tight']">
              <span className="flex items-center gap-4">
                <Image src={"Group.svg"} width={120} height={40} alt="Sui text" />
                <span className="bg-[#030F1C] text-white rounded-lg px-2 py-1 text-2xl font-['Inter_Tight']">Testnet Faucet</span>
              </span>
            </div>

          </div>
          <p className="text-[15px] text-gray-600 max-w-xl mx-auto leading-relaxed font-['Inter_Tight']">
            Get free SUI tokens for testing and development on the Sui testnet. Simply enter your wallet address below to receive testnet tokens.
          </p>
         
        </div>

        {/* Faucet Card */}
        <div className="max-w-lg mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm pt-0">
            <CardHeader className="text-center pb-6 p-2">
              <div className="flex justify-end items-end mb-6">

                <ConnectButton />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-800 font-['Inter_Tight']">
                Request Testnet Tokens
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                Enter your Sui wallet address to receive {config?.faucetAmount ?? "..."} SUI tokens
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              {/* Wallet Input */}
              <div className="space-y-2">
                <label htmlFor="wallet" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Wallet Address
                </label>
                <div className="relative mb-10">
                  <Input
                    id="wallet"
                    type="text"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="pl-4 pr-12 h-12 text-sm font-mono border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                  />

                  {walletAddress && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
                      onClick={() => navigator.clipboard.writeText(walletAddress)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}

                </div>


                {walletAddress && !isValidAddress && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Please enter a valid Sui address starting with 0x
                  </p>
                )}
              </div>
                    <p className="text-center font-medium text-[15px]">
            Available Faucet:{" "}
            <span className="font-normal text-blue-700">
              {config ? config.availableBalance.toFixed(2) : "..."}
            </span>{" "}
            SUI
          </p>
              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!isValidAddress || loading}
                className="w-full h-[47.12px] bg-[#2B7FFF] hover:bg-blue-700 text-white font-medium text-[15.7px] 
                shadow-[0px_9.81px_14.72px_-2.94px_rgba(0,0,0,0.1),_0px_3.92px_5.88px_-3.92px_rgba(0,0,0,0.1)] rounded-[7.85px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Requesting Tokens...
                  </div>
                ) : response?.status === "success" ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Tokens Sent!
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    Request {config?.faucetAmount ?? "0.01"} SUI
                  </div>
                )}
              </Button>
              <div className="flex justify-center text-[#4A5565] text-sm gap-2 mt-4" >
                <p className="flex items-center"><BsDot className="font-black text-2xl"/>{config?.faucetAmount ?? "..."} SUI per request</p>
                <p className="flex items-center"><BsDot className="font-black text-2xl"/>{config?.maxRequestsPerWallet ?? "..."} request per {(config?.cooldownSeconds ? (config.cooldownSeconds / 3600).toFixed(0) : '24')} hrs</p>
              </div>
            
              <p></p>
              {/* Response Message */}
              {response?.status === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Tokens sent successfully!</p>
                      <p className="text-sm text-green-600 mt-1">
                        Tokens have been sent to your wallet. It may take a few moments to appear.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {response?.status === "error" && response.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">{response.error}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Footer Notice */}
        <FaucetModal
          tx={tx}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          isSuccess={isClaimSuccess}
          nextClaimTimestamp={nextClaimTimestamp}
        />
        <div className="text-center mt-12 text-xs text-gray-500">
          <p>This faucet provides testnet tokens only. These tokens have no monetary value.</p>
        </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative  border-t border-blue-100">
        <div className="bg-[#011829]">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center space-y-6">
  
              <div className="flex justify-evenly w-full ">

                <div className="gap-2 flex flex-col items-start">
                  <span className="flex items-center">
                    <Image src={"/sui-white.png"} width={100} height={30} alt="sui" />
                    <span className="bg-[#030F1C] border border-[#C0E6FF]  text-[#C0E6FF] rounded-lg px-2 h-fit text-xl">Testnet Faucet</span>
                  </span>
                  <p className="text-[#C0E6FF]"> Reach out for custom built dapps on our socials</p>
                  <span className="flex text-[#C0E6FF] text-xl space-x-4">

                   <Link href={"https://github.com/shivareddyVanja/"}> <FaDiscord /></Link> 
                    <Link href="https://x.com/0xtitan__"><FaXTwitter /></Link>
                   <Link href="https://discord.com/0xtitan__"> <FaGithub /></Link> 
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-[15px] text-white mb-2 flex items-center gap-2">

                    Useful Links
                  </h3>
                  <span className="text-sm text-gray-600 space-y-1 flex flex-col">
                    <a href="https://suiscan.xyz/testnet/home" className="text-blue-600 hover:underline flex items-center">Sui Explorer</a>
                    <a href="https://docs.sui.io/" className="text-blue-600 hover:underline">Documentation</a>
                    <a href="https://discord.com/invite/sui" className="text-blue-600 hover:underline">Discord Support</a>
                  </span>
                </div>
              </div>


              {/* Divider */}
              <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />

              {/* Bottom section */}
                <div className="flex flex-col sm:flex-row items-center justify-evenly w-full max-w-4xl gap-4 text-xs text-[#C0E6FF]">
                <p className="flex-inline gap-1 text-center">
                  © 2025 Suicet. Made with
                  <span className="text-red-500 animate-pulse mx-1">♥</span>
                  for the Sui community.
                </p>
               
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
