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
    <div className={`transition-all duration-500 ease-in-out ${show ? 'h-16 sm:h-20 opacity-100' : 'h-16 sm:h-20 opacity-0'} flex items-center justify-center`}>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent px-4 max-w-4xl">
        {message}
      </h2>
    </div>
  )
}