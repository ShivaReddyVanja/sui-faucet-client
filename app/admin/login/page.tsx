'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet, WalletProvider } from '@suiet/wallet-kit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Shield, ArrowRight } from 'lucide-react';
import StyledConnectButton from '@/components/ConnectButton';
import axios from 'axios';


function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connected, account, signPersonalMessage } = useWallet();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async () => {
    if (!connected || !account?.address) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const message = `SuiFaucetAdminLogin_${Date.now()}_${account.address}`;
      const messageBytes = new TextEncoder().encode(message);

      // Wallet signs messageBytes (Uint8Array)
      const signed = await signPersonalMessage({
        message: messageBytes,
      });
      console.log('Signed output:', signed);

      if (!signed?.signature || !signed?.bytes) {
        throw new Error('Failed to sign message - missing signature or bytes');
      }


      const signedBytes = signed.bytes; // This is already base64

      const response = await axios.post(`${apiUrl}/admin/login`, {
        walletAddress: account.address,
        message,
        signature: signed.signature,
        signedBytes: signedBytes, // Use wallet's returned bytes
      }, {
        withCredentials: true,
      });
      const { accessToken } = response.data;
  
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('walletAddress', account.address);
      
      router.push("/admin");
    } catch (err: any) {
      const message =
        err?.response?.data?.error || err.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };



  const getTruncatedAddress = () => {
    if (!account?.address) return '';
    const address = account.address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sui-cloud to-sui-aqua p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sui-aqua to-sui-blue rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Sign in with your Sui wallet to access the admin panel
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {!connected ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <StyledConnectButton />
              
                <p className="text-black font-semibold text-sm mt-1">
                  Please connect your Sui wallet to continue
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">Wallet Connected</p>
                    <p className="text-green-600 text-sm font-mono">
                      {getTruncatedAddress()}
                    </p>
                  </div>
                </div>
              </div>
                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-black text-white font-medium py-3 rounded-lg 
    transition-all duration-200 transform hover:scale-101 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing Message...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="text-center text-xs text-gray-700 space-y-2">
            <p>
              By signing in, you agree to sign a message to verify your wallet ownership.
            </p>
            <p>
              This action is required for secure admin access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <WalletProvider>
      <LoginContent />
    </WalletProvider>
  );
} 