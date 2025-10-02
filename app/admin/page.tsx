"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WaitingListEntry {
  _id: string
  email: string
  subscribed_at: string
  created_at: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [entries, setEntries] = useState<WaitingListEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Handle login with API instead of direct function call
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true)
        localStorage.setItem("admin_authenticated", "true")
        localStorage.setItem("admin_token", password) // Store token for API calls
        fetchEntries()
      } else {
        setError(data.message || "Invalid password")
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setError("Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch entries from API endpoint instead of direct function call
  const fetchEntries = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("admin_token") || password;
      
      const response = await fetch('/api/emails', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setEntries(result.data);
      } else {
        setError("Failed to fetch entries: " + (result.message || "Unknown error"));
        if (response.status === 401) {
          // Handle unauthorized
          setIsAuthenticated(false);
          localStorage.removeItem("admin_authenticated");
          localStorage.removeItem("admin_token");
        }
      }
    } catch (error) {
      console.error("Error fetching entries:", error)
      setError("Failed to fetch entries")
    } finally {
      setLoading(false)
    }
  }
  
  // Check if user is already authenticated
  useEffect(() => {
    const isAuth = localStorage.getItem("admin_authenticated") === "true"
    if (isAuth) {
      setIsAuthenticated(true)
      fetchEntries()
    }
  }, [])
  
  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_token")
  }
  
  // Handle refresh data
  const handleRefresh = () => {
    fetchEntries()
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : "Login"}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                {loading ? "Refreshing..." : "Refresh Data"}
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Waiting List Entries ({entries.length})</CardTitle>
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : entries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase">
                      <tr>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Subscribed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry) => (
                        <tr key={entry._id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{entry.email}</td>
                          <td className="px-6 py-4">
                            {new Date(entry.subscribed_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-4">No entries found</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}