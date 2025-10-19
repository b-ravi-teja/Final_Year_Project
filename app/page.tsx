"use client"

import { useState } from "react"
import { Moon, Sun } from "lucide-react"
import UserRegistration from "@/components/user-registration"
import AdminPanel from "@/components/admin-panel"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"user" | "admin">("user")
  const [isDark, setIsDark] = useState(true)

  // Apply dark mode to document
  if (typeof document !== "undefined") {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">⛓️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">BlockID</h1>
                <p className="text-sm text-muted-foreground">Blockchain-Based Identification</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)} className="rounded-full">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("user")}
              className={`border-b-2 px-1 py-4 font-medium transition-colors ${
                activeTab === "user"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              User Registration
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`border-b-2 px-1 py-4 font-medium transition-colors ${
                activeTab === "admin"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Admin Panel
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {activeTab === "user" && <UserRegistration />}
        {activeTab === "admin" && <AdminPanel />}
      </main>
    </div>
  )
}
