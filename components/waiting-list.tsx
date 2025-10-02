"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { subscribeEmail } from "@/app/actions"

export function WaitingList() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setIsError(false)
    
    try {
      const response = await subscribeEmail(email)
      
      if (response.success) {
        setSubmitted(true)
        setMessage(response.message)
      } else {
        setIsError(true)
        setMessage(response.message)
      }
    } catch (error) {
      setIsError(true)
      setMessage("An unexpected error occurred. Please try again.")
      console.error("Error submitting email:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="max-w-3xl w-full mx-auto text-center space-y-12">
        {/* Main heading with gradient effect */}
        <h1 
          className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white"
        >
          Accelerate Humanoid Intelligence
        </h1>
        
        {!submitted ? (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-900 border-gray-800 text-white h-12 focus-visible:ring-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <Button 
                type="submit" 
                className="h-12 px-8 bg-white text-black hover:bg-gray-200 transition-all duration-200"
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
            {isError && <p className="text-red-400 text-sm mt-2">{message}</p>}
          </div>
        ) : (
          <div className="animate-fade-in">
            <p className="text-gray-300 text-lg">{message || "We'll notify you when we launch."}</p>
          </div>
        )}
      </div>
      
      {/* Subtle animated gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70"></div>
    </div>
  )
}