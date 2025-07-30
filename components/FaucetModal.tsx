"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaExternalLinkAlt } from "react-icons/fa";
import Lottie from "lottie-react";
import Drop from "@/public/lottie/drop.json";
import Panda from "@/public/lottie/sleeping-panda.json"

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
      <DialogContent className="sm:max-w-[400px]  rounded-lg pt-6 text-center px-2">
        <DialogHeader className="flex flex-col items-center space-y-4">
          <DialogTitle className="text-2xl font-bold">
            {isSuccess ? <span className="flex items-center text-2xl">
            <CheckCircle className="text-green-500 mr-1"/>Claim Successful!</span>:
             "Claim Not Available Yet"
             }
          </DialogTitle>
          {isSuccess ? (
            // 
            <Lottie
        animationData={Drop}
        loop={true}
        autoplay={true}
        style={{ width: 100, height: 100 }}
      />
          ) : (
            <Lottie
        animationData={Panda}
        loop={true}
        autoplay={true}
        style={{ width: 200, height: 100 }}
      />
          )}
          <DialogDescription className="font-semibold text-base text-center">
            {isSuccess
              ? "Your SUI tokens have been sent"
              : "You are trying to claim early, please wait for the timer to finish !"}
          </DialogDescription>
        </DialogHeader>
        {  isSuccess?(
        <Link href={`https://suiscan.xyz/testnet/tx/${tx}`} className="text-blue-700 font-semibold hover:underline flex items-center justify-center ">
          View Transaction <FaExternalLinkAlt className="ml-2"/>
        </Link>) 
        :(<div className="mt-4 text-4xl font-bold text-primary">{formatTime(timeLeft)}</div>)}
        <div>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-1/2 bg-gradient-to-r from-blue-400 to-teal-400 text-white hover:from-blue-500 hover:to-teal-500"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
