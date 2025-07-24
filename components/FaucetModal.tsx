"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FaucetModalProps {
  tx?:string,
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isSuccess: boolean
  nextClaimTimestamp: number | null // Unix timestamp in milliseconds
}

export function FaucetModal({ isOpen, onOpenChange, isSuccess, nextClaimTimestamp,tx }: FaucetModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    if (!isOpen || !nextClaimTimestamp) {
      setTimeLeft(0)
      return
    }

    const calculateTimeLeft = () => {
      const now = Date.now()
      const difference = nextClaimTimestamp - now
      setTimeLeft(Math.max(0, Math.floor(difference / 1000))) // Time in seconds
    }

    calculateTimeLeft() // Initial calculation

    const timer = setInterval(() => {
      calculateTimeLeft()
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, nextClaimTimestamp])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-lg p-6 text-center">
        <DialogHeader className="flex flex-col items-center space-y-4">
          {isSuccess ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <Clock className="h-16 w-16 text-yellow-500" />
          )}
          <DialogTitle className="text-2xl font-bold">
            {isSuccess ? "Claim Successful!" : "Claim Not Available Yet"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base text-center">
            {isSuccess
              ? "Your SUI tokens have been sent. Check your transaction below"
              : "You have recently claimed. Please wait until the timer below expires before your next claim."}
          </DialogDescription>
        </DialogHeader>
        {  isSuccess?(
        <Link href={`https://suiscan.xyz/testnet/tx/${tx}`} className="text-blue-400 hover:underline">
          View Transaction
        </Link>) 
        :(<div className="mt-6 text-4xl font-bold text-primary">{formatTime(timeLeft)}</div>)}
        <div className="mt-6">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-r from-blue-400 to-teal-400 text-white hover:from-blue-500 hover:to-teal-500"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
