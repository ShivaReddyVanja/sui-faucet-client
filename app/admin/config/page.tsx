"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { updateFaucetConfig, getFaucetConfig, FaucetConfigUpdate } from '@/services/config';

export default function FaucetConfigPage() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [faucetAmount, setFaucetAmount] = useState(0.01)
  const [cooldownPeriod, setCooldownPeriod] = useState(60)
  const [maxRequestsPerIp, setMaxRequestsPerIp] = useState(5)
  const [maxRequestsPerWallet, setMaxRequestsPerWallet] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadCurrentConfig();
  }, [])

  const loadCurrentConfig = async () => {
    setIsLoading(true)
    try {
      const result = await getFaucetConfig()
      
      if (result.success && result.config) {
        const config = result.config
        
        // Map backend config to frontend state
        setIsEnabled(config.enabled)
        setFaucetAmount(config.faucetAmount)
        setCooldownPeriod(config.cooldownSeconds)
        setMaxRequestsPerIp(config.maxRequestsPerIp)
        setMaxRequestsPerWallet(config.maxRequestsPerWallet)
        
        console.log('Loaded config:', config)
      }
    } catch (error: any) {
      console.error('Failed to load config:', error)
      toast.error("Failed to load configuration", {
        description: error.message || "Could not fetch current settings"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      const configUpdate: FaucetConfigUpdate = {
        faucetAmount: faucetAmount,
        cooldownSeconds: cooldownPeriod,
        maxRequestsPerIp: maxRequestsPerIp,
        maxRequestsPerWallet:maxRequestsPerWallet, 
        enabled: isEnabled,
      }
      console.log(faucetAmount,"while saving")
      const result = await updateFaucetConfig(configUpdate)
      
      if (result.success) {
        toast.success("Configuration Saved!", {
          description: "Faucet settings have been updated successfully."
        })
        
        // Reload config to ensure UI shows latest values
        await loadCurrentConfig()
      }
    } catch (error: any) {
      console.error('Failed to update config:', error)
      
      if (error.message.includes('Validation failed')) {
        toast.error("Validation Error", {
          description: "Please check your input values and try again."
        })
      } else if (error.message.includes('Authentication failed')) {
        toast.error("Authentication Error", {
          description: "Please login again to continue."
        })
      } else {
        toast.error("Update Failed", {
          description: error.message || "Failed to update configuration."
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card className="max-w-2xl mx-auto w-full bg-sui-cloud/10 backdrop-blur-lg rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-sui-aqua" />
            <span className="ml-2 text-sui-cloud">Loading configuration...</span>
          </div>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card className="max-w-2xl mx-auto w-full bg-sui-cloud/10 backdrop-blur-lg rounded-2xl shadow-xl lg:p-6 text-sui-cloud">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-sm lg:text-base">
            Faucet Configuration
            <Button
              variant="outline"
              size="sm"
              onClick={loadCurrentConfig}
              disabled={isSaving}
              className="text-sui-aqua border-sui-aqua hover:bg-sui-aqua/10"
            >
              <Loader2 className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription className="text-sui-aqua text-xs lg:text-sm">
            Manage the operational settings of your SUI Faucet.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between space-x-2 text-xs">
            <Label htmlFor="enabled">Faucet Enabled</Label>
            <Switch 
              id="enabled" 
              checked={isEnabled} 
              onCheckedChange={setIsEnabled}
              disabled={isSaving}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="faucet-amount">Faucet Amount (SUI)</Label>
            <Input
              id="faucet-amount"
              type="number"
              step="0.1"
              min="0"
              value={faucetAmount}
              onChange={(e) => setFaucetAmount(Number(e.target.value))}
              disabled={isSaving}
              className="bg-sui-cloud/20 border-sui-aqua text-sui-cloud placeholder:text-sui-aqua/70"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cooldown-period">Cooldown Period (seconds)</Label>
            <Input
              id="cooldown-period"
              type="number"
              min="1"
              value={cooldownPeriod}
              onChange={(e) => setCooldownPeriod(Number(e.target.value))}
              disabled={isSaving}
              className="bg-sui-cloud/20 border-sui-aqua text-sui-cloud placeholder:text-sui-aqua/70"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="max-requests-ip">Max Requests per IP</Label>
            <Input
              id="max-requests-ip"
              type="number"
              min="1"
              value={maxRequestsPerIp}
              onChange={(e) => setMaxRequestsPerIp(Number(e.target.value))}
              disabled={isSaving}
              className="bg-sui-cloud/20 border-sui-aqua text-sui-cloud placeholder:text-sui-aqua/70"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="max-requests-wallet">Max Requests per Wallet</Label>
            <Input
              id="max-requests-wallet"
              type="number"
              min="1"
              value={maxRequestsPerWallet}
              onChange={(e) => setMaxRequestsPerWallet(Number(e.target.value))}
              disabled={isSaving}
              className="bg-sui-cloud/20 border-sui-aqua text-sui-cloud placeholder:text-sui-aqua/70"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-black text-white  hover:bg-sui-sea/90 transition-colors w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Configuration...
              </>
            ) : (
              "Save Configuration"
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
