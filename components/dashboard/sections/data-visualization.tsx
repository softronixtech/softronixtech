"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Thermometer, Zap, Wifi, RefreshCw } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock real-time data generator
const generateRealtimeData = () => {
  const now = new Date()
  const data = []

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      temperature: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 20,
      power: 80 + Math.random() * 40,
      network: 70 + Math.random() * 30,
    })
  }
  return data
}

const energyData = [
  { device: "HVAC", consumption: 45, efficiency: 92 },
  { device: "Lighting", consumption: 23, efficiency: 88 },
  { device: "Security", consumption: 12, efficiency: 95 },
  { device: "Sensors", consumption: 8, efficiency: 97 },
  { device: "Network", consumption: 12, efficiency: 89 },
]

const networkTrafficData = [
  { name: "HTTP", value: 35, color: "#FF0B55" },
  { name: "MQTT", value: 28, color: "#CF0F47" },
  { name: "CoAP", value: 20, color: "#FFDEDE" },
  { name: "WebSocket", value: 17, color: "#FF6B9D" },
]

// Add export functionality to data visualization

// Add export handlers
const handleExportChart = (chartType: string, data: any) => {
  const exportData = {
    type: chartType,
    timestamp: new Date().toISOString(),
    data: data,
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${chartType}-data-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function DataVisualization() {
  const [realtimeData, setRealtimeData] = useState(generateRealtimeData())
  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setRealtimeData(generateRealtimeData())
      setLastUpdate(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [isLive])

  const refreshData = () => {
    setRealtimeData(generateRealtimeData())
    setLastUpdate(new Date())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Urbanist'] mb-2">Data Visualization</h1>
          <p className="text-gray-400">Real-time analytics and sensor data insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? "bg-green-400" : "bg-gray-400"}`} />
            <span className="text-sm text-gray-400 font-['IBM_Plex_Mono']">
              {isLive ? "Live" : "Paused"} • Updated {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsLive(!isLive)} className="border-gray-700">
            {isLive ? "Pause" : "Resume"}
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData} className="border-gray-700 bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 font-['Urbanist']">Avg Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-[#FF0B55]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-['Urbanist']">
              {realtimeData[realtimeData.length - 1]?.temperature.toFixed(1)}°C
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <p className="text-xs text-green-400">+2.1% from yesterday</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 font-['Urbanist']">Humidity Level</CardTitle>
            <div className="w-4 h-4 bg-blue-400 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-['Urbanist']">
              {realtimeData[realtimeData.length - 1]?.humidity.toFixed(0)}%
            </div>
            <p className="text-xs text-gray-400 mt-1">Optimal range: 40-60%</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 font-['Urbanist']">Power Usage</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-['Urbanist']">
              {realtimeData[realtimeData.length - 1]?.power.toFixed(0)}W
            </div>
            <p className="text-xs text-green-400 mt-1">-5.2% efficiency gain</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 font-['Urbanist']">Network Load</CardTitle>
            <Wifi className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-['Urbanist']">
              {realtimeData[realtimeData.length - 1]?.network.toFixed(0)}%
            </div>
            <p className="text-xs text-gray-400 mt-1">Bandwidth utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environmental Data */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-white font-['Urbanist']">Environmental Sensors</CardTitle>
              <CardDescription className="text-gray-400">Temperature and humidity over 24 hours</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportChart("realtime", realtimeData)}
              className="border-gray-700 bg-transparent"
            >
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stackId="1"
                  stroke="#FF0B55"
                  fill="#FF0B55"
                  fillOpacity={0.3}
                  name="Temperature (°C)"
                />
                <Area
                  type="monotone"
                  dataKey="humidity"
                  stackId="2"
                  stroke="#CF0F47"
                  fill="#CF0F47"
                  fillOpacity={0.3}
                  name="Humidity (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Power & Network */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-white font-['Urbanist']">System Performance</CardTitle>
              <CardDescription className="text-gray-400">Power consumption and network activity</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportChart("realtime", realtimeData)}
              className="border-gray-700 bg-transparent"
            >
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="power" stroke="#FFDEDE" strokeWidth={2} name="Power (W)" />
                <Line type="monotone" dataKey="network" stroke="#FF6B9D" strokeWidth={2} name="Network (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Energy & Network Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Consumption */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-white font-['Urbanist']">Energy Consumption</CardTitle>
              <CardDescription className="text-gray-400">Device power usage and efficiency</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportChart("energy", energyData)}
              className="border-gray-700 bg-transparent"
            >
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="device" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="consumption" fill="#FF0B55" name="Consumption (W)" />
                <Bar dataKey="efficiency" fill="#CF0F47" name="Efficiency (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Network Traffic */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-white font-['Urbanist']">Network Traffic</CardTitle>
              <CardDescription className="text-gray-400">Protocol distribution</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportChart("network", networkTrafficData)}
              className="border-gray-700 bg-transparent"
            >
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={networkTrafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {networkTrafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {networkTrafficData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-300 font-['IBM_Plex_Mono']">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Logs */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white font-['Urbanist']">System Logs</CardTitle>
          <CardDescription className="text-gray-400">Real-time device activity and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black rounded-lg p-4 font-['IBM_Plex_Mono'] text-sm space-y-1 max-h-64 overflow-y-auto">
            <div className="text-green-400">
              [{new Date().toLocaleTimeString()}] INFO: Temperature sensor reading:{" "}
              {realtimeData[realtimeData.length - 1]?.temperature.toFixed(2)}°C
            </div>
            <div className="text-blue-400">
              [{new Date(Date.now() - 1000).toLocaleTimeString()}] DEBUG: Network packet received from device_001
            </div>
            <div className="text-yellow-400">
              [{new Date(Date.now() - 2000).toLocaleTimeString()}] WARN: Humidity level approaching threshold
            </div>
            <div className="text-green-400">
              [{new Date(Date.now() - 3000).toLocaleTimeString()}] INFO: Power optimization routine completed
            </div>
            <div className="text-blue-400">
              [{new Date(Date.now() - 4000).toLocaleTimeString()}] DEBUG: MQTT message published to topic/sensors/env
            </div>
            <div className="text-green-400">
              [{new Date(Date.now() - 5000).toLocaleTimeString()}] INFO: Device health check passed
            </div>
            <div className="text-purple-400">
              [{new Date(Date.now() - 6000).toLocaleTimeString()}] AI: Anomaly detection scan completed - no issues
              found
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
