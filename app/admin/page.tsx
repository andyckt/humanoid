"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'

interface WaitingListSubscriber {
  _id: string;
  email: string;
  subscribed_at: string;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [emails, setEmails] = useState<WaitingListSubscriber[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password) {
      setError('Please enter the password')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/admin/emails', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Invalid password')
      }
      
      const data = await response.json()
      setEmails(data.emails)
      setAuthenticated(true)
    } catch (error) {
      setError('Authentication failed. Please check your password.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a')
    } catch (error) {
      return dateString
    }
  }

  const handleExport = () => {
    // Create CSV content
    const csvContent = [
      'Email,Subscribed At,Created At',
      ...emails.map(sub => 
        `"${sub.email}","${formatDate(sub.subscribed_at)}","${formatDate(sub.created_at)}"`
      )
    ].join('\n')
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `waiting-list-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {!authenticated ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter the password to access the admin panel</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Authenticating...' : 'Login'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Waiting List Subscribers</h1>
            <Button onClick={handleExport} variant="outline">Export to CSV</Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableCaption>List of all waiting list subscribers</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscribed At</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.length > 0 ? (
                    emails.map((subscriber) => (
                      <TableRow key={subscriber._id}>
                        <TableCell>{subscriber.email}</TableCell>
                        <TableCell>{formatDate(subscriber.subscribed_at)}</TableCell>
                        <TableCell>{formatDate(subscriber.created_at)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">No subscribers found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <p className="text-sm text-muted-foreground">Total subscribers: {emails.length}</p>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
