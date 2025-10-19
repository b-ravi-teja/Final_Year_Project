"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface User {
  id: string
  walletAddress: string
  hash: string
  auth: boolean
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    // Simulate fetching users from API
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users").catch(() => ({
          ok: true,
          json: async () => ({
            users: [
              {
                id: "1",
                walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f1234",
                hash: "QmXxxx1234567890abcdef",
                auth: false,
              },
              {
                id: "2",
                walletAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
                hash: "QmYyyy0987654321fedcba",
                auth: false,
              },
              {
                id: "3",
                walletAddress: "0x9ca2f110662CE443914756Bd247B137eee75ECA83",
                hash: "QmZzzz1111222233334444",
                auth: true,
              },
            ],
          }),
        }))

        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
        }
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleVerify = async (userId: string, walletAddress: string, hash: string) => {
    setVerifying(userId)
    try {
      // Simulate verification API call
      const response = await fetch("/api/verifyUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, hash }),
      }).catch(() => ({
        ok: true,
        json: async () => ({ verified: true }),
      }))

      if (response.ok) {
        const data = await response.json()
        if (data.verified) {
          setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, auth: true } : user)))
          setSuccessMessage("User verified successfully on blockchain.")
          setTimeout(() => setSuccessMessage(null), 3000)
        }
      }
    } catch (error) {
      console.error("Verification failed:", error)
    } finally {
      setVerifying(null)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.hash.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert className="border-primary/50 bg-primary/10">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>User Records</CardTitle>
          <CardDescription>
            {users.length} total users • {users.filter((u) => u.auth).length} verified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by wallet address or hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Wallet Address</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Hash</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                          {user.walletAddress.substring(0, 10)}...
                          {user.walletAddress.substring(user.walletAddress.length - 8)}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                          {user.hash.substring(0, 12)}...
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {user.auth ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-primary" />
                              <span className="text-primary">Verified</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Pending</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {!user.auth && (
                          <Button
                            size="sm"
                            onClick={() => handleVerify(user.id, user.walletAddress, user.hash)}
                            disabled={verifying === user.id}
                            className="bg-primary hover:bg-primary/90"
                          >
                            {verifying === user.id ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              "Verify"
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{users.filter((u) => u.auth).length}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{users.filter((u) => !u.auth).length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
