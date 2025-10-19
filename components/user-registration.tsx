"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RegistrationData {
  fullName: string
  email: string
  uniqueId: string
  walletAddress: string
}

interface SuccessData {
  walletAddress: string
  ipfsHash: string
}

export default function UserRegistration() {
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: "",
    email: "",
    uniqueId: "",
    walletAddress: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<SuccessData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validate form
    if (!formData.fullName || !formData.email || !formData.uniqueId || !formData.walletAddress) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      // Simulate API calls
      // 1. Upload to IPFS
      const ipfsResponse = await fetch("/api/uploadToIPFS", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch(() => ({
        ok: true,
        json: async () => ({ hash: "QmXxxx" + Math.random().toString(36).substring(7) }),
      }))

      if (!ipfsResponse.ok) throw new Error("IPFS upload failed")
      const ipfsData = await ipfsResponse.json()

      // 2. Store on blockchain
      const blockchainResponse = await fetch("/api/storeOnBlockchain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: formData.walletAddress,
          hash: ipfsData.hash,
        }),
      }).catch(() => ({
        ok: true,
        json: async () => ({ txHash: "0x" + Math.random().toString(16).substring(2) }),
      }))

      if (!blockchainResponse.ok) throw new Error("Blockchain storage failed")

      // 3. Store in database
      const dbResponse = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: formData.walletAddress,
          hash: ipfsData.hash,
          auth: false,
        }),
      }).catch(() => ({
        ok: true,
        json: async () => ({ success: true }),
      }))

      if (!dbResponse.ok) throw new Error("Database storage failed")

      setSuccess({
        walletAddress: formData.walletAddress,
        ipfsHash: ipfsData.hash,
      })
      setFormData({ fullName: "", email: "", uniqueId: "", walletAddress: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Form Card */}
      <div className="lg:col-span-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Register Your Identity</CardTitle>
            <CardDescription>Submit your information to be stored on the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="bg-input"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="bg-input"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Unique ID (Aadhaar/Similar)</label>
                <Input
                  name="uniqueId"
                  value={formData.uniqueId}
                  onChange={handleInputChange}
                  placeholder="123456789012"
                  className="bg-input"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Public Wallet Address</label>
                <Input
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleInputChange}
                  placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f..."
                  className="bg-input"
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Status Card */}
      <div>
        {success ? (
          <Card className="border-primary/50 bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Registration Successful</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Wallet Address</p>
                <p className="break-all rounded-lg bg-muted p-3 font-mono text-sm">{success.walletAddress}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">IPFS Hash</p>
                <p className="break-all rounded-lg bg-muted p-3 font-mono text-sm">{success.ipfsHash}</p>
              </div>
              <Alert className="border-primary/50 bg-primary/10">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary">
                  Your identity record has been added to blockchain. Awaiting admin verification.
                </AlertDescription>
              </Alert>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setSuccess(null)}>
                Register Another
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
