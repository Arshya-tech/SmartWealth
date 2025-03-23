import Image from "next/image"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-8 w-auto">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SmartWealth_Logo-dF5aPioztHnVD1PPJxRD5rTZdcRFEj.png"
          alt="SmartWealth Logo"
          width={150}
          height={32}
          className="object-contain"
        />
      </div>
    </div>
  )
}

