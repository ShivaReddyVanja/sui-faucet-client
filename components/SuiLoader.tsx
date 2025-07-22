"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function SuiLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {" "}
        {/* Increased size for spinner */}
        <motion.div
          className="absolute w-full h-full border-4 border-t-transparent border-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
        <div className="relative w-24 h-24">
          {" "}
          {/* Container for the logo, adjust size as needed */}
          <Image
            src="/sui.svg"
            alt="Sui Logo Loader"
            layout="fill"
            objectFit="contain"
            priority // Preload the image as it's a critical loading element [^2][^3]
            unoptimized // SVGs generally don't need optimization [^3]
          />
        </div>
      </div>
    </div>
  )
}
