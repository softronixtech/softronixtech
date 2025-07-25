"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Cpu, AlertTriangle, BarChart3, Zap, Shield, Settings, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import logo from "../../public/logo.svg"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "devices", label: "Device Control", icon: Cpu },
  { id: "maintenance", label: "Predictive Maintenance", icon: AlertTriangle },
  { id: "analytics", label: "Data Visualization", icon: BarChart3 },
  { id: "automation", label: "Remote Automation", icon: Zap },
  { id: "integrations", label: "Secure Integrations", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-900 text-white hover:bg-gray-800 h-10 w-10"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 z-40 transition-all duration-300",
          "lg:relative lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64 sm:w-72 lg:w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <img src={logo.src} alt="" />
                  
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left h-10 sm:h-12 transition-all duration-200 text-sm sm:text-base",
                    isActive
                      ? "bg-gradient-to-r from-[#CF0F47]/20 to-[#FF0B55]/20 text-[#FF0B55] border-r-2 border-[#FF0B55]"
                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                    isCollapsed && "justify-center px-0",
                  )}
                  onClick={() => {
                    onSectionChange(item.id)
                    setIsMobileOpen(false)
                  }}
                >
                  <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", !isCollapsed && "mr-2 sm:mr-3")} />
                  {!isCollapsed && <span className="font-['Urbanist'] font-medium truncate">{item.label}</span>}
                </Button>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-3 sm:p-4 border-t border-gray-800">
            {!isCollapsed && (
              <div className="mb-3">
                <p className="text-white text-sm font-medium font-['Urbanist'] truncate">{user?.name}</p>
                <p className="text-gray-400 text-xs font-['IBM_Plex_Mono'] truncate">{user?.email}</p>
              </div>
            )}
            <Button
              variant="ghost"
              className={cn(
                "w-full text-gray-400 hover:text-red-400 hover:bg-red-900/20 h-10",
                isCollapsed ? "justify-center px-0" : "justify-start",
              )}
              onClick={handleLogout}
            >
              <LogOut className={cn("h-4 w-4 sm:h-5 sm:w-5", !isCollapsed && "mr-2 sm:mr-3")} />
              {!isCollapsed && <span className="font-['Urbanist']">Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
