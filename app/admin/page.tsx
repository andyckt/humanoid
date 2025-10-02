"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllEmails } from "@/lib/email-service"

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
  
  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "AHR2025") {
      setIsAuthenticated(true)
      localStorage.setItem("admin_authenticated", "true")
      fetchEntries()
    } else {
      setError("Invalid password")
    }
  }
  
  // Fetch entries from MongoDB
  const fetchEntries = async () => {
    setLoading(true)
    try {
      const data = await getAllEmails();
      setEntries(data as WaitingListEntry[]);
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
              <Button type="submit" className="w-full">
                Login
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
