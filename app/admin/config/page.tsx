"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"


export default function FaucetConfigPage() {

  const [isEnabled, setIsEnabled] = useState(true)
  const [faucetAmount, setFaucetAmount] = useState("0.01")
  const [cooldownPeriod, setCooldownPeriod] = useState("60") // seconds
  const [maxRequestsPerIp, setMaxRequestsPerIp] = useState("5")
  const [maxRequestsPerWallet, setMaxRequestsPerWallet] = useState("1")

  const handleSave = () => {
    // In a real application, you would send this data to your backend
    console.log({
      isEnabled,
      faucetAmount: Number.parseFloat(faucetAmount),
      cooldownPeriod: Number.parseInt(cooldownPeriod),
      maxRequestsPerIp: Number.parseInt(maxRequestsPerIp),
      maxRequestsPerWallet: Number.parseInt(maxRequestsPerWallet),
    })
    toast(
      "Configuration Saved!Faucet settings have been updated."
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card className="max-w-2xl mx-auto w-full bg-sui-cloud/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-sui-cloud">
        <CardHeader>
          <CardTitle>Faucet Configuration</CardTitle>
          <CardDescription className="text-sui-aqua">
            Manage the operational settings of your SUI Faucet.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="enabled">Faucet Enabled</Label>
            <Switch id="enabled" checked={isEnabled} onCheckedChange={setIsEnabled} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="faucet-amount">Faucet Amount (SUI)</Label>
            <Input
              id="faucet-amount"
              type="number"
              step="0.001"
              value={faucetAmount}
              onChange={(e) => setFaucetAmount(e.target.value)}
              className="bg-sui-cloud/20 border-sui-aqua text-sui-cloud placeholder:text-sui-aqua/70"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cooldown-period">Cooldown Period (seconds)</Label>
            <Input
              id="cooldown-period"
              type="number"
              value={cooldownPeriod}
              onChange={(e) => setCooldownPeriod(e.target.value)}
              className="bg-sui-cloud/20 border-sui-aqua text-sui-cloud placeholder:text-sui-aqua/70"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="max-requests-ip">Max Requests per IP</Label>
            <Input
              id="max-requests-ip"
              type="number"
              value={maxRequestsPerIp}
              onChange={(e) => setMaxRequestsPerIp(e.target.value)}
              className="bg-sui-cloud/20 border-sui-aqua text-sui-cloud placeholder:text-sui-aqua/70"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="max-requests-wallet">Max Requests per Wallet</Label>
            <Input
              id="max-requests-wallet"
              type="number"
              value={maxRequestsPerWallet}
              onChange={(e) => setMaxRequestsPerWallet(e.target.value)}
              className="bg-sui-cloud/20 border-sui-aqua text-sui-cloud placeholder:text-sui-aqua/70"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} className="bg-sui-sea text-sui-cloud hover:bg-sui-sea/90 transition-colors">
            Save Configuration
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
