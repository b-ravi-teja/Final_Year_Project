"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminLogin from "./admin-login"
import AdminDashboard from "./admin-dashboard"

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage and verify user identities</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      <AdminDashboard />
    </div>
  )
}
