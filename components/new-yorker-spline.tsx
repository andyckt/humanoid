"use client"

import type React from "react"

import { SplineScene } from "@/components/ui/splite"
import { Spotlight } from "@/components/ui/spotlight"
import { useState, useEffect } from "react"
import { WaitingList } from "@/components/waiting-list"

export function NewYorkerSpline() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showEnter, setShowEnter] = useState(false)
  const [showWaitingList, setShowWaitingList] = useState(false)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  const handleEnterClick = () => {
    setShowWaitingList(true)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnter(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="h-screen w-full bg-white text-black relative overflow-hidden font-serif"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 flex flex-col">
        {/* Main content */}
        <div className="w-full h-screen relative bg-black overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 grid-background"></div>
          {/* ENTER Text - Top Right */}
          <div className="absolute top-6 right-6 z-20">
            <span
              className={`text-sm font-serif tracking-wider text-white/60 hover:text-white cursor-pointer transition-all duration-800 ease-out ${
                showEnter ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              }`}
              onClick={handleEnterClick}
            >
              ENTER
            </span>
          </div>
          <div className="relative z-10 w-full h-full">
            <Spotlight className="left-1/2 top-1/2" size={300} />
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
      
      {/* Waiting List Interface */}
      {showWaitingList && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 transition-all duration-500 ease-in-out">
          <WaitingList />
        </div>
      )}
    </div>
  )
}
