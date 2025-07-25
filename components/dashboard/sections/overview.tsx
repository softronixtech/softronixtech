"use client"

import { useDashboard } from "@/contexts/dashboard-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, Activity, AlertTriangle, Zap, Shield, Database } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data for charts
const performanceData = [
  { time: "00:00", cpu: 45, memory: 62, network: 78 },
  { time: "04:00", cpu: 52, memory: 58, network: 82 },
  { time: "08:00", cpu: 68, memory: 71, network: 85 },
  { time: "12:00", cpu: 75, memory: 69, network: 88 },
  { time: "16:00", cpu: 71, memory: 73, network: 91 },
  { time: "20:00", cpu: 58, memory: 65, network: 86 },
]

const deviceTypeData = [
  { name: "Sensors", value: 35, color: "#FF0B55" },
  { name: "Cameras", value: 25, color: "#CF0F47" },
  { name: "Controllers", value: 20, color: "#FFDEDE" },
  { name: "Actuators", value: 20, color: "#FF6B9D" },
]

export function Overview() {
  const { devices, alerts, integrations } = useDashboard()

  const onlineDevices = devices.filter((d) => d.status === "online").length
  const offlineDevices = devices.filter((d) => d.status === "offline").length
  const maintenanceDevices = devices.filter((d) => d.status === "maintenance").length
  const activeAlerts = alerts.filter((a) => a.severity === "high" || a.severity === "medium").length
  const connectedIntegrations = integrations.filter((i) => i.status === "connected").length

  const stats = [
    {
      title: "Total Devices",
      value: devices.length.toString(),
      description: `${onlineDevices} online, ${offlineDevices} offline`,
      icon: Cpu,
      trend: "+12%",
      color: "text-green-400",
    },
    {
      title: "System Uptime",
      value: "99.8%",
      description: "Last 30 days average",
      icon: Activity,
      trend: "+0.2%",
      color: "text-blue-400",
    },
    {
      title: "Active Alerts",
      value: activeAlerts.toString(),
      description: `${alerts.length} total notifications`,
      icon: AlertTriangle,
      trend: "-5%",
      color: activeAlerts > 0 ? "text-red-400" : "text-green-400",
    },
    {
      title: "Energy Efficiency",
      value: "94.2%",
      description: "Optimized consumption",
      icon: Zap,
      trend: "+3.1%",
      color: "text-[#FF0B55]",
    },
    {
      title: "Data Throughput",
      value: "2.4 GB/h",
      description: "Real-time processing",
      icon: Database,
      trend: "+8.7%",
      color: "text-purple-400",
    },
    {
      title: "Integrations",
      value: connectedIntegrations.toString(),
      description: `${integrations.length} total connections`,
      icon: Shield,
      trend: "Stable",
      color: "text-green-400",
    },
  ]

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="px-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-['Urbanist'] mb-2">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm sm:text-base">Real-time insights into your IoT infrastructure</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors min-w-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 font-['Urbanist'] truncate pr-2 min-w-0">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-white font-['Urbanist'] mb-1 truncate">
                    {stat.value}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-500 truncate flex-1 min-w-0">{stat.description}</p>
                    <Badge
                      variant="outline"
                      className={`${stat.color} border-current text-xs flex-shrink-0 whitespace-nowrap`}
                    >
                      {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Performance Chart */}
          <Card className="bg-gray-900 border-gray-800 min-w-0">
            <CardHeader>
              <CardTitle className="text-white font-['Urbanist'] text-lg sm:text-xl truncate">
                System Performance
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">24-hour resource utilization</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="w-full h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="cpu" stroke="#FF0B55" strokeWidth={2} />
                    <Line type="monotone" dataKey="memory" stroke="#CF0F47" strokeWidth={2} />
                    <Line type="monotone" dataKey="network" stroke="#FFDEDE" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Device Distribution */}
          <Card className="bg-gray-900 border-gray-800 min-w-0">
            <CardHeader>
              <CardTitle className="text-white font-['Urbanist'] text-lg sm:text-xl truncate">
                Device Distribution
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">Connected device types</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="w-full h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <Pie
                      data={deviceTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4">
                {deviceTypeData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 min-w-0">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs sm:text-sm text-gray-300 font-['IBM_Plex_Mono'] truncate">
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-900 border-gray-800 min-w-0">
          <CardHeader>
            <CardTitle className="text-white font-['Urbanist'] text-lg sm:text-xl">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400 text-sm">Latest system events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {alerts.slice(0, 5).map((alert, index) => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-3 sm:space-x-4 p-3 bg-gray-800 rounded-lg min-w-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      alert.severity === "high"
                        ? "bg-red-400"
                        : alert.severity === "medium"
                          ? "bg-yellow-400"
                          : "bg-green-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-['Urbanist'] mb-1 break-words">{alert.message}</p>
                    <p className="text-gray-400 text-xs font-['IBM_Plex_Mono'] truncate">
                      {alert.deviceName} • {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      alert.type === "error" ? "destructive" : alert.type === "warning" ? "secondary" : "default"
                    }
                    className="text-xs flex-shrink-0 whitespace-nowrap"
                  >
                    {alert.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
