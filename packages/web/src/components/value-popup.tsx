import { useEffect, useState } from "react"
import { X, TrendingUp, DollarSign, Clock, Shield, Zap, CheckCircle } from "lucide-react"

interface ValuePopupProps {
  message: string
  detail?: string
  icon?: "savings" | "time" | "security" | "speed" | "success" | "automation"
  position?: "top" | "bottom"
  delay?: number
  duration?: number
  color?: "blue" | "green" | "orange" | "purple"
}

const iconMap = {
  savings: DollarSign,
  time: Clock,
  security: Shield,
  speed: Zap,
  success: CheckCircle,
  automation: TrendingUp,
}

const colorMap = {
  blue: "bg-blue-600",
  green: "bg-green-600",
  orange: "bg-orange-600",
  purple: "bg-purple-600",
}

export function ValuePopup({
  message,
  detail,
  icon = "success",
  position = "top",
  delay = 0,
  duration = 5000,
  color = "blue",
}: ValuePopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  
  const Icon = iconMap[icon]
  const bgColor = colorMap[color]
  
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    
    const hideTimer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(() => setIsVisible(false), 300) // Wait for exit animation
    }, delay + duration)
    
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [delay, duration])
  
  if (!isVisible) return null
  
  return (
    <div
      className={`
        fixed z-50 transition-all duration-300 transform
        ${position === "top" ? "top-20" : "bottom-20"}
        left-1/2 -translate-x-1/2
        ${isLeaving ? "opacity-0 scale-95" : "opacity-100 scale-100"}
      `}
    >
      <div className={`${bgColor} text-white rounded-lg shadow-2xl p-4 pr-10 max-w-md animate-bounce-subtle`}>
        <button
          onClick={() => {
            setIsLeaving(true)
            setTimeout(() => setIsVisible(false), 300)
          }}
          className="absolute top-2 right-2 text-white/80 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-base">{message}</p>
            {detail && <p className="text-sm text-white/90 mt-1">{detail}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}