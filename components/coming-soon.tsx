import { Construction } from "lucide-react"

interface ComingSoonProps {
  title: string
  description?: string
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-white rounded-lg border shadow-sm">
      <Construction className="h-16 w-16 text-primary mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-lg text-gray-600 text-center max-w-md mb-6">
        {description || "This feature is currently under development and will be available soon."}
      </p>
      <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: "35%" }}></div>
      </div>
      <p className="text-sm text-gray-500 mt-2">Development progress: 35%</p>
    </div>
  )
}

