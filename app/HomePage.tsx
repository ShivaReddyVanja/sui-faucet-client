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

export default function Component() {
  const searchParams = useSearchParams();
  const { account } = useWallet();
 const [token, setToken] = useState<string | null>(null);

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
    if (!token) {
      toast.error('Please complete the challenge');
      setLoading(false);
      return;
    }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="relative z-10 container mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs px-2 py-1">
                  Testnet
                </Badge>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Sui Testnet Faucet
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get free SUI tokens for testing and development on the Sui testnet. Simply enter your wallet address below to receive testnet tokens.
          </p>
          <p className="text-lg font-medium">
                  Available Faucet:{" "}
                  <span className="font-normal text-gray-700">
                    {config ? config.availableBalance.toFixed(2) : "..."}
                  </span>{" "}
                  SUI
                </p>
        </div>

        {/* Faucet Card */}
        <div className="max-w-lg mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-end items-end">
                
                <ConnectButton />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Request Testnet Tokens
              </CardTitle>
              <CardDescription className="text-gray-600">
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
                <div className="relative">
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

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!isValidAddress || loading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-medium text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  Faucet Limits
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li >• {config?.faucetAmount ?? "..."} SUI per request</li>
                  <li>• {config?.maxRequestsPerWallet ?? "..."} request per {(config?.cooldownSeconds ? (config.cooldownSeconds / 3600).toFixed(0) : '24')} hrs</li>
                  <li>• Testnet only</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-teal-500" />
                  Useful Links
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex">• <a href="https://suiscan.xyz/testnet/home" className="text-blue-600 hover:underline flex items-center ml-1">Sui Explorer <FaExternalLinkAlt className="text-xs ml-1" /></a></li>
                  <li>• <a href="https://docs.sui.io/" className="text-blue-600 hover:underline">Documentation</a></li>
                  <li>• <a href="https://discord.com/invite/sui" className="text-blue-600 hover:underline">Discord Support</a></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Notice */}
        <FaucetModal
          tx={tx}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          isSuccess={isClaimSuccess}
          nextClaimTimestamp={nextClaimTimestamp}
        />
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>This faucet provides testnet tokens only. These tokens have no monetary value.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-16 border-t border-blue-100">
        <div className="bg-[#011829] backdrop">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center space-y-6">
              {/* Logo and description */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-600 text-center max-w-md leading-relaxed">
                  Reach out for custom built dapps, on our socials.
                </p>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/yourusername/sui-faucet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 transition-all duration-200 hover:shadow-lg hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-500 hover:border-transparent"
                >
                  <FaGithub className="text-lg text-gray-700 group-hover:text-white transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-white">GitHub</span>
                </a>
                <a
                  href="https://twitter.com/yourhandle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 transition-all duration-200 hover:shadow-lg hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-500 hover:border-transparent"
                >
                  <FaXTwitter className="text-lg text-gray-700 group-hover:text-white transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-white">Twitter</span>
                </a>
                <a
                  href="https://discord.com/invite/sui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 transition-all duration-200 hover:shadow-lg hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-500 hover:border-transparent"
                >
                  <FaDiscord className="text-lg text-gray-700 group-hover:text-white transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-white">Discord</span>
                </a>
              </div>

              {/* Divider */}
              <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />

              {/* Bottom section */}
              <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl gap-4 text-sm text-gray-500">
                <p className="flex-inline gap-1 text-center">
                  © 2025 Suicet. Made with
                  <span className="text-red-500 animate-pulse mx-1">♥</span>
                  for the Sui community.
                </p>
                <div className="flex items-center gap-6">
                  <a href="/privacy" className="hover:text-blue-600 transition-colors hover:underline">
                    Privacy Policy
                  </a>
                  <a href="/terms" className="hover:text-blue-600 transition-colors hover:underline">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
