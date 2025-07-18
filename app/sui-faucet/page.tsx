"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, Wallet, Copy, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
import { FaucetResponse } from "@/lib/types"
import { requestFaucet } from "@/utils/api"
import { toast } from "sonner"

export default function Component() {
  const [walletAddress, setWalletAddress] = useState('');
  const [response, setResponse] = useState<FaucetResponse |null>(null);
  const [loading, setLoading] = useState(false);

  const isValidSuiAddress = (address: string) => /^0x[a-fA-F0-9]{64}$/.test(address);


 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(null);
    setLoading(true);

    if (!isValidSuiAddress(walletAddress)) {
      setResponse({ error: 'Invalid Sui wallet address' });
      setLoading(false);
      return;
    }

    const result = await requestFaucet(walletAddress);
    setResponse(result);
    result.status==="success"?toast.success(result.message):toast.error(result.error);
    setLoading(false);
  };

  const isValidAddress = walletAddress.length > 0 && walletAddress.startsWith("0x")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Background Pattern */}
     
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
            Get free SUI tokens for testing and development on the Sui testnet. 
            Simply enter your wallet address below to receive testnet tokens.
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-lg mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold text-gray-800">Request Testnet Tokens</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your Sui wallet address to receive 10 SUI tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    Request 0.000001 SUI
                  </div>
                )}
              </Button>

              {response?.status === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Tokens sent successfully!</p>
                      <p className="text-sm text-green-600 mt-1">
                        0.000001 SUI tokens have been sent to your wallet. It may take a few moments to appear.
                      </p>
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
                  <li>• 0.000001 SUI per request</li>
                  <li>• 12 request per hour</li>
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
                  <li>• <a href="https://suiscan.xyz/testnet/home" className="text-blue-600 hover:underline">Sui Explorer</a></li>
                  <li>• <a href="https://docs.sui.io/" className="text-blue-600 hover:underline">Documentation</a></li>
                  <li>• <a href="https://discord.com/invite/sui" className="text-blue-600 hover:underline">Discord Support</a></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>This faucet provides testnet tokens only. These tokens have no monetary value.</p>
        </div>
      </div>
    </div>
  )
}
