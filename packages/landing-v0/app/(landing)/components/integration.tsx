'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useAnimation, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const integrations = [
  {
    title: 'Email Forwarding',
    description: "Turn emails into tasks instantly—just forward them to hypr, and we'll handle the rest.",
    shape: 'envelope'
  },
  {
    title: 'Desktop App',
    description: "Coming soon: Manage your tasks right from your desktop with our new app—designed for a smoother workflow.",
    shape: 'monitor'
  },
  {
    title: 'Slack Integration',
    description: "Coming soon: Seamlessly integrate hypr with Slack to create tasks directly from your team chats.",
    shape: 'chat'
  },
  {
    title: 'Team Collaboration',
    description: "Coming soon: Collaborate effortlessly—share tasks and projects with your team for unified productivity.",
    shape: 'people'
  }
]

const AbstractShape = ({ shape, className }: { shape: string; className?: string }) => {
  const baseClass = "w-32 h-32 relative"
  const shapeClass = `${baseClass} ${className}`

  const renderShape = () => {
    switch (shape) {
      case 'envelope':
        return (
          <div className={shapeClass}>
            <div className="absolute inset-0 bg-purple-200 transform rotate-3 skew-y-3" />
            <div className="absolute top-1/4 left-1/6 right-1/6 h-1/2 bg-purple-300 transform -skew-y-6" />
            <div className="absolute top-1/4 left-1/6 w-2/3 h-1/2 bg-purple-100 transform skew-y-12" />
          </div>
        )
      case 'monitor':
        return (
          <div className={shapeClass}>
            <div className="absolute inset-0 bg-purple-200 rounded-lg transform -skew-x-6" />
            <div className="absolute top-1/8 left-1/8 right-1/8 bottom-1/4 bg-purple-300 rounded-sm" />
            <div className="absolute top-3/4 left-1/4 right-1/4 bottom-1/8 bg-purple-100 rounded-full" />
          </div>
        )
      case 'chat':
        return (
          <div className={shapeClass}>
            <div className="absolute inset-0 bg-purple-200 rounded-full transform skew-x-6" />
            <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-purple-300 rotate-45" />
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/8 bg-purple-100 rounded-full" />
            <div className="absolute top-1/2 left-1/4 w-1/3 h-1/8 bg-purple-100 rounded-full" />
          </div>
        )
      case 'people':
        return (
          <div className={shapeClass}>
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-purple-200 rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-300 rounded-full" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-100 rounded-full" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative">
      {renderShape()}
      <div className="absolute inset-0 bg-purple-100 opacity-20 blur-xl" />
    </div>
  )
}

export default function Component() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [carouselWidth, setCarouselWidth] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    if (carouselRef.current) {
      setCarouselWidth(carouselRef.current.offsetWidth)
    }
  }, [])

  const cardWidth = carouselWidth / 3 - 16 // Show 3 cards with some gap

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % integrations.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + integrations.length) % integrations.length)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = cardWidth / 4
    if (info.offset.x < -threshold) {
      nextSlide()
    } else if (info.offset.x > threshold) {
      prevSlide()
    }
    controls.start({ x: -currentIndex * (cardWidth + 16) })
  }

  useEffect(() => {
    controls.start({ x: -currentIndex * (cardWidth + 16) })
  }, [currentIndex, cardWidth, controls])

  return (
    <div className="bg-[#070707] text-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold mb-4">Works with your tools and soon with your team</h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl">
          Expand Your Capabilities with Integrations That Keep You Focused and Organized
        </p>
        <div className="relative overflow-hidden" ref={carouselRef}>
          <motion.div
            className="flex"
            drag="x"
            dragConstraints={{ left: -carouselWidth, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            animate={controls}
          >
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.title}
                className="flex-shrink-0 bg-[#111111] rounded-lg p-6 flex flex-col mr-4 transition-all duration-300 hover:bg-gray-800 relative overflow-hidden"
                style={{ width: cardWidth, height: 400 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-grow flex items-center justify-center mb-6">
                  <AbstractShape shape={integration.shape} className="transform hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 relative z-10">{integration.title}</h3>
                <p className="text-gray-400 mb-4 text-sm relative z-10">{integration.description}</p>
              </motion.div>
            ))}
          </motion.div>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-10 rounded-full p-2 transition-all duration-300 hover:bg-opacity-20"
            aria-label="Previous integration"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-10 rounded-full p-2 transition-all duration-300 hover:bg-opacity-20"
            aria-label="Next integration"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-center mt-8">
          {integrations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Go to integration ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}