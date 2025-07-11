"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function WaitingList() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimateIn(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate submission - will be replaced with actual backend call later
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 800)
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-6 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 grid-background opacity-30"></div>
        
        {/* Gradient orb */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"
          style={{ 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            animation: 'pulse 8s ease-in-out infinite alternate'
          }}
        ></div>
      </div>

      <div 
        className={`max-w-3xl w-full mx-auto text-center space-y-16 relative z-10 transition-all duration-1000 ease-out ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Main heading with gradient effect */}
        <div className="space-y-6">
          <h1 
            className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white"
          >
            Accelerate Humanoid Intelligence
          </h1>
          
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
        </div>
        
        {!submitted ? (
          <div 
            className="space-y-8 max-w-lg mx-auto"
            style={{ 
              transitionDelay: '200ms',
              animation: animateIn ? 'fadeIn 0.8s ease-out 0.2s forwards' : 'none',
              opacity: 0
            }}
          >
            <p className="text-lg md:text-xl text-gray-300">
              Join the waiting list for early access.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-900/50 backdrop-blur-sm border-gray-800 text-white h-14 focus-visible:ring-gray-500 px-5 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <Button 
                type="submit" 
                className="h-14 px-8 bg-white text-black hover:bg-gray-200 transition-all duration-200 rounded-lg font-medium"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                  </span>
                ) : "Join"}
              </Button>
            </form>
          </div>
        ) : (
          <div 
            className="space-y-6 animate-fade-in max-w-lg mx-auto py-8 px-6 rounded-xl bg-white/5 backdrop-blur-sm"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium">Thank you for joining</h2>
            <p className="text-gray-400">We'll notify you when we launch.</p>
          </div>
        )}
      </div>
      
      {/* Subtle animated gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70"></div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  )
} 