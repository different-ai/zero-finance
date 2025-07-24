import { useEffect, useState } from "react"

interface ValueBannerProps {
  message: string
  isVisible: boolean
}

export function ValueBanner({ message, isVisible }: ValueBannerProps) {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    if (isVisible) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [isVisible])
  
  return (
    <div className={`transition-all duration-500 ease-in-out ${show ? 'h-12 sm:h-16 opacity-100' : 'h-12 sm:h-16 opacity-0'} flex items-center justify-center`}>
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-gray-900 px-4 max-w-4xl">
        {message}
      </h2>
    </div>
  )
}