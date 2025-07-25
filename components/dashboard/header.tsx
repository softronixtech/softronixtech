"use client"

import { useAuth } from "@/contexts/auth-context"
import { useDashboard } from "@/contexts/dashboard-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, User, Wifi, WifiOff, Activity } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, logout } = useAuth()
  const { alerts, devices } = useDashboard()

  const onlineDevices = devices.filter((d) => d.status === "online").length
  const totalDevices = devices.length
  const unreadAlerts = alerts.length

  return (
    <header className="h-14 sm:h-16 bg-gray-900 border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between min-w-0 overflow-hidden">
      {/* Left side - Status indicators */}
      <div className="flex items-center space-x-3 sm:space-x-6 min-w-0 flex-shrink-0">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="flex items-center space-x-1 min-w-0">
            {onlineDevices > 0 ? (
              <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
            ) : (
              <WifiOff className="h-3 w-3 sm:h-4 sm:w-4 text-red-400 flex-shrink-0" />
            )}
            <span className="text-xs sm:text-sm text-gray-300 font-['IBM_Plex_Mono'] whitespace-nowrap">
              {onlineDevices}/{totalDevices} Online
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-1 min-w-0">
          <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-[#FF0B55] flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-300 font-['IBM_Plex_Mono'] whitespace-nowrap">
            System Active
          </span>
        </div>
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-400 hover:text-white h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadAlerts > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 bg-[#FF0B55] text-white text-xs flex items-center justify-center">
                  {unreadAlerts > 9 ? "9+" : unreadAlerts}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 sm:w-80 bg-gray-900 border-gray-800">
            <DropdownMenuLabel className="text-white font-['Urbanist']">
              Notifications ({unreadAlerts})
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            {alerts.slice(0, 3).map((alert) => (
              <DropdownMenuItem key={alert.id} className="text-gray-300 hover:bg-gray-800 focus:bg-gray-800 p-3">
                <div className="flex flex-col space-y-1 w-full min-w-0">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        alert.type === "error" ? "destructive" : alert.type === "warning" ? "secondary" : "default"
                      }
                      className="text-xs flex-shrink-0"
                    >
                      {alert.type}
                    </Badge>
                    <span className="text-xs text-gray-400 font-['IBM_Plex_Mono'] flex-shrink-0">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm break-words">{alert.message}</p>
                  <p className="text-xs text-gray-500 truncate">{alert.deviceName}</p>
                </div>
              </DropdownMenuItem>
            ))}
            {alerts.length === 0 && (
              <DropdownMenuItem className="text-gray-500 p-3">No new notifications</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
        >
          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-300 hover:text-white h-8 sm:h-10 px-2 sm:px-3 min-w-0"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[#CF0F47] to-[#FF0B55] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <div className="hidden md:block text-left min-w-0">
                <p className="text-sm font-medium font-['Urbanist'] truncate max-w-24">{user?.name}</p>
                <p className="text-xs text-gray-400 font-['IBM_Plex_Mono'] truncate">{user?.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 w-48">
            <DropdownMenuLabel className="text-white font-['Urbanist']">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="text-gray-300 hover:bg-gray-800 focus:bg-gray-800">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:bg-gray-800 focus:bg-gray-800">
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20" onClick={logout}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
