"use client"

import { useAuth } from "@/contexts/auth-context"
import { Login } from "@/components/auth/login"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainDashboard } from "@/components/dashboard/main-dashboard"
import { DashboardProvider } from "@/contexts/dashboard-context"

export default function Home() {
  const { user } = useAuth()

  if (!user) {
    return <Login />
  }

  return (
    <ProtectedRoute>
      <DashboardProvider>
        <MainDashboard />
      </DashboardProvider>
    </ProtectedRoute>
  )
}
