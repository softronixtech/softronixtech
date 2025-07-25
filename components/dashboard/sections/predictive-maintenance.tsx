"use client"

import { useState, useEffect } from "react"
import { useDashboard } from "@/contexts/dashboard-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Brain, 
  Wrench, 
  X, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Check,
  Calendar,
  Clock,
  TrendingDown,
  TrendingUp,
  Activity,
  Shield,
  Battery,
  Thermometer,
  Camera,
  Lock,
  Wifi,
  ChevronRight,
  Download,
  Filter,
  RefreshCw
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"
import { format, addDays, subDays } from "date-fns"

// Enhanced mock data with more realistic patterns
const generateHealthTrendData = () => {
  const data = []
  const baseDate = new Date()
  
  for (let i = 30; i >= 0; i--) {
    const date = subDays(baseDate, i)
    data.push({
      date: format(date, "MMM dd"),
      fullDate: date,
      thermostat: 95 - (i * 0.3) + Math.random() * 5,
      camera: 88 - (i * 0.5) + Math.random() * 3,
      lock: 92 - (i * 0.2) + Math.random() * 4,
      sensor: 76 - (i * 0.8) + Math.random() * 6,
    })
  }
  
  return data
}

const healthTrendData = generateHealthTrendData()

// Device performance metrics
const deviceMetrics = [
  {
    id: "1",
    name: "Smart Thermostat",
    icon: Thermometer,
    health: 85,
    uptime: 99.2,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-02-15",
    metrics: {
      temperature_accuracy: 98,
      response_time: 92,
      energy_efficiency: 88,
      connectivity: 95,
      battery_level: 100
    },
    issues: [
      { type: "warning", message: "Temperature drift detected", timestamp: new Date() },
      { type: "info", message: "Firmware update available", timestamp: new Date() }
    ]
  },
  {
    id: "2",
    name: "Security Camera",
    icon: Camera,
    health: 70,
    uptime: 97.5,
    lastMaintenance: "2023-12-20",
    nextMaintenance: "2024-01-27",
    metrics: {
      image_quality: 82,
      motion_detection: 75,
      night_vision: 68,
      connectivity: 90,
      storage_usage: 85
    },
    issues: [
      { type: "error", message: "Lens cleaning required", timestamp: new Date() },
      { type: "warning", message: "Storage 85% full", timestamp: new Date() }
    ]
  },
  {
    id: "3",
    name: "Smart Lock",
    icon: Lock,
    health: 78,
    uptime: 99.8,
    lastMaintenance: "2024-01-01",
    nextMaintenance: "2024-02-10",
    metrics: {
      battery_level: 65,
      response_time: 88,
      security_status: 100,
      connectivity: 92,
      mechanical_wear: 75
    },
    issues: [
      { type: "warning", message: "Battery replacement recommended", timestamp: new Date() }
    ]
  },
  {
    id: "4",
    name: "Environmental Sensor",
    icon: Activity,
    health: 58,
    uptime: 95.3,
    lastMaintenance: "2023-11-15",
    nextMaintenance: "2024-01-24",
    metrics: {
      temperature_sensor: 65,
      humidity_sensor: 55,
      air_quality: 60,
      connectivity: 88,
      calibration_status: 45
    },
    issues: [
      { type: "error", message: "Calibration overdue", timestamp: new Date() },
      { type: "warning", message: "Sensor drift detected", timestamp: new Date() }
    ]
  }
]

// Enhanced AI insights with more details
const aiInsights = [
  {
    id: "1",
    title: "Critical: Sensor Calibration Required",
    description: "Environmental Sensor showing 15% drift in temperature readings compared to baseline",
    confidence: 94,
    recommendation: "Immediate calibration required to prevent false alerts",
    severity: "high",
    affectedDevice: "Environmental Sensor",
    predictedImpact: "May cause incorrect HVAC adjustments, increasing energy costs by ~20%",
    estimatedDowntime: "45 minutes",
    costSavings: "$120/month",
    automationAvailable: true
  },
  {
    id: "2",
    title: "Battery Replacement Needed Soon",
    description: "Smart Lock battery at 65% - degradation rate increased by 40% in last week",
    confidence: 89,
    recommendation: "Replace battery within 7 days to avoid lockout",
    severity: "medium",
    affectedDevice: "Smart Lock",
    predictedImpact: "Complete device failure possible within 10-14 days",
    estimatedDowntime: "15 minutes",
    costSavings: "$50 (emergency callout prevention)",
    automationAvailable: false
  },
  {
    id: "3",
    title: "Camera Lens Degradation",
    description: "Image quality decreased by 18% due to lens contamination and UV damage",
    confidence: 76,
    recommendation: "Schedule cleaning and apply UV protective coating",
    severity: "low",
    affectedDevice: "Security Camera",
    predictedImpact: "Reduced motion detection accuracy in low light conditions",
    estimatedDowntime: "30 minutes",
    costSavings: "$200 (replacement prevention)",
    automationAvailable: false
  },
  {
    id: "4",
    title: "Firmware Optimization Available",
    description: "New firmware can improve thermostat efficiency by 12% based on usage patterns",
    confidence: 91,
    recommendation: "Update during off-peak hours for minimal disruption",
    severity: "low",
    affectedDevice: "Smart Thermostat",
    predictedImpact: "Energy savings of approximately $30/month",
    estimatedDowntime: "10 minutes",
    costSavings: "$360/year",
    automationAvailable: true
  }
]

// Maintenance history
const maintenanceHistory = [
  {
    id: "h1",
    device: "Smart Thermostat",
    type: "Filter Replacement",
    date: "2024-01-15",
    technician: "John Smith",
    duration: 30,
    cost: 45,
    notes: "Replaced HEPA filter, cleaned sensors",
    status: "completed"
  },
  {
    id: "h2",
    device: "Security Camera",
    type: "Lens Cleaning",
    date: "2023-12-20",
    technician: "Sarah Johnson",
    duration: 45,
    cost: 60,
    notes: "Deep cleaned lens, adjusted focus",
    status: "completed"
  },
  {
    id: "h3",
    device: "Smart Lock",
    type: "Battery Replacement",
    date: "2024-01-01",
    technician: "Mike Wilson",
    duration: 15,
    cost: 25,
    notes: "Replaced with high-capacity battery",
    status: "completed"
  }
]

// Cost analysis data
const costAnalysisData = [
  { month: "Jan", preventive: 180, reactive: 450, savings: 270 },
  { month: "Feb", preventive: 200, reactive: 380, savings: 180 },
  { month: "Mar", preventive: 150, reactive: 520, savings: 370 },
  { month: "Apr", preventive: 220, reactive: 410, savings: 190 },
  { month: "May", preventive: 190, reactive: 480, savings: 290 },
  { month: "Jun", preventive: 210, reactive: 390, savings: 180 }
]

// Device reliability scores for radar chart
const reliabilityData = [
  { metric: "Uptime", A: 99, B: 97, C: 99, D: 95, fullMark: 100 },
  { metric: "Efficiency", A: 88, B: 75, C: 82, D: 60, fullMark: 100 },
  { metric: "Response", A: 92, B: 82, C: 88, D: 65, fullMark: 100 },
  { metric: "Accuracy", A: 98, B: 82, C: 90, D: 55, fullMark: 100 },
  { metric: "Reliability", A: 95, B: 78, C: 85, D: 58, fullMark: 100 }
]

export function PredictiveMaintenance() {
  const { alerts, dismissAlert, devices, maintenanceTasks, completeMaintenance, scheduleMaintenance } = useDashboard()
  
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [selectedDevice, setSelectedDevice] = useState("all")
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<typeof aiInsights[0] | null>(null)
  const [autoSchedule, setAutoSchedule] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update device metrics slightly
      deviceMetrics.forEach(device => {
        device.health += (Math.random() - 0.5) * 2
        device.health = Math.max(0, Math.min(100, device.health))
      })
    }, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-400 bg-red-900/20 border-red-800"
      case "medium":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-800"
      case "low":
        return "text-green-400 bg-green-900/20 border-green-800"
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-400"
      case "medium":
        return "bg-yellow-400"
      case "low":
        return "bg-green-400"
      default:
        return "bg-gray-400"
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-400"
    if (health >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const handleScheduleMaintenance = (insight: typeof aiInsights[0]) => {
    setSelectedInsight(insight)
    setMaintenanceDialogOpen(true)
  }

  const handleConfirmSchedule = () => {
    if (selectedInsight) {
      const scheduledDate = autoSchedule 
        ? new Date(Date.now() + 1000 * 60 * 60 * 24) // Tomorrow
        : new Date(Date.now() + 1000 * 60 * 60 * 48) // 48 hours
        
      scheduleMaintenance({
        deviceId: selectedInsight.affectedDevice,
        deviceName: selectedInsight.affectedDevice,
        type: selectedInsight.title,
        scheduledDate: scheduledDate,
        priority: selectedInsight.severity as "low" | "medium" | "high",
        status: "pending",
        assignedTo: autoSchedule ? "AI System" : "Technician",
        estimatedDuration: parseInt(selectedInsight.estimatedDowntime),
      })
      
      setMaintenanceDialogOpen(false)
      setSelectedInsight(null)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  const handleExportReport = () => {
    // Simulate report export
    console.log("Exporting maintenance report...")
  }

  const filteredHealthData = selectedDevice === "all" 
    ? healthTrendData 
    : healthTrendData.map(d => ({
        date: d.date,
        [selectedDevice]: d[selectedDevice as keyof typeof d]
      }))

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Urbanist'] mb-2">Predictive Maintenance</h1>
          <p className="text-gray-400">AI-powered insights for proactive device maintenance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[140px] bg-gray-800 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            className={`border-gray-700 ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportReport}
            className="border-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-['IBM_Plex_Mono']">Total Devices</p>
                <p className="text-2xl font-bold text-white font-['Urbanist']">{deviceMetrics.length}</p>
              </div>
              <Shield className="h-8 w-8 text-[#FF0B55]" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-['IBM_Plex_Mono']">Avg Health Score</p>
                <p className="text-2xl font-bold text-white font-['Urbanist']">
                  {Math.round(deviceMetrics.reduce((acc, d) => acc + d.health, 0) / deviceMetrics.length)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-['IBM_Plex_Mono']">Active Issues</p>
                <p className="text-2xl font-bold text-white font-['Urbanist']">
                  {deviceMetrics.reduce((acc, d) => acc + d.issues.length, 0)}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-['IBM_Plex_Mono']">Monthly Savings</p>
                <p className="text-2xl font-bold text-white font-['Urbanist']">$740</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#FF0B55]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="devices">Device Health</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {aiInsights.map((insight) => (
              <Card key={insight.id} className={`bg-gray-900 border-gray-800`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-[#FF0B55]" />
                      <CardTitle className="text-white font-['Urbanist'] text-lg">{insight.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className={getSeverityColor(insight.severity)}>
                      {insight.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">{insight.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-800 p-3 rounded">
                      <p className="text-gray-400 font-['IBM_Plex_Mono'] text-xs">AFFECTED DEVICE</p>
                      <p className="text-white font-['Urbanist']">{insight.affectedDevice}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <p className="text-gray-400 font-['IBM_Plex_Mono'] text-xs">DOWNTIME</p>
                      <p className="text-white font-['Urbanist']">{insight.estimatedDowntime}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-['IBM_Plex_Mono']">AI Confidence</span>
                      <span className="text-white font-['Urbanist']">{insight.confidence}%</span>
                    </div>
                    <Progress value={insight.confidence} className="h-2" />
                  </div>

                  <div className="bg-gray-800 p-3 rounded-lg space-y-2">
                    <p className="text-xs text-gray-400 font-['IBM_Plex_Mono']">PREDICTED IMPACT</p>
                    <p className="text-white text-sm font-['Urbanist']">{insight.predictedImpact}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                      <span className="text-xs text-gray-400">Potential Savings</span>
                      <span className="text-green-400 font-bold">{insight.costSavings}</span>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 font-['IBM_Plex_Mono'] mb-1">RECOMMENDATION</p>
                    <p className="text-white text-sm font-['Urbanist']">{insight.recommendation}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-[#FF0B55] hover:bg-[#E00A4D]"
                      onClick={() => handleScheduleMaintenance(insight)}
                    >
                      <Wrench className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    {insight.automationAvailable && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-700 bg-transparent"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Auto-Fix
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Device Health Tab */}
        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deviceMetrics.map((device) => {
              const Icon = device.icon
              return (
                <Card key={device.id} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-800 rounded-lg">
                          <Icon className="h-6 w-6 text-[#FF0B55]" />
                        </div>
                        <div>
                          <CardTitle className="text-white font-['Urbanist']">{device.name}</CardTitle>
                          <CardDescription className="text-gray-400">
                            Last maintained: {device.lastMaintenance}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getHealthColor(device.health)}`}>
                          {Math.round(device.health)}%
                        </p>
                        <p className="text-xs text-gray-400">Health Score</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 font-['IBM_Plex_Mono'] text-xs">UPTIME</p>
                        <p className="text-white font-['Urbanist'] font-bold">{device.uptime}%</p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 font-['IBM_Plex_Mono'] text-xs">NEXT SERVICE</p>
                        <p className="text-white font-['Urbanist'] font-bold">
                          {format(new Date(device.nextMaintenance), "MMM dd")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {Object.entries(device.metrics).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 capitalize">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className={`font-bold ${value >= 80 ? "text-green-400" : value >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                              {value}%
                            </span>
                          </div>
                          <Progress value={value} className="h-1.5" />
                        </div>
                      ))}
                    </div>

                    {device.issues.length > 0 && (
                      <div className="border-t border-gray-800 pt-3">
                        <p className="text-xs text-gray-400 font-['IBM_Plex_Mono'] mb-2">ACTIVE ISSUES</p>
                        <div className="space-y-2">
                          {device.issues.map((issue, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              {issue.type === "error" ? (
                                <XCircle className="h-4 w-4 text-red-400 mt-0.5" />
                              ) : issue.type === "warning" ? (
                                <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5" />
                              )}
                              <p className="text-sm text-gray-300">{issue.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full bg-gray-800 hover:bg-gray-700" 
                      variant="outline"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Health Trends Chart */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white font-['Urbanist']">Device Health Trends</CardTitle>
                  <CardDescription className="text-gray-400">
                    AI-analyzed health scores over time
                  </CardDescription>
                </div>
                <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Devices</SelectItem>
                    <SelectItem value="thermostat">Thermostat</SelectItem>
                    <SelectItem value="camera">Camera</SelectItem>
                    <SelectItem value="lock">Lock</SelectItem>
                    <SelectItem value="sensor">Sensor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredHealthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  {selectedDevice === "all" ? (
                    <>
                      <Line type="monotone" dataKey="thermostat" stroke="#FF0B55" strokeWidth={2} name="Thermostat" />
                      <Line type="monotone" dataKey="camera" stroke="#CF0F47" strokeWidth={2} name="Camera" />
                      <Line type="monotone" dataKey="lock" stroke="#FFDEDE" strokeWidth={2} name="Lock" />
                      <Line type="monotone" dataKey="sensor" stroke="#FF6B9D" strokeWidth={2} name="Sensor" />
                    </>
                  ) : (
                    <Line 
                      type="monotone" 
                      dataKey={selectedDevice} 
                      stroke="#FF0B55" 
                      strokeWidth={2} 
                      name={selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)} 
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Analysis Chart */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-['Urbanist']">Cost Analysis</CardTitle>
                <CardDescription className="text-gray-400">
                  Preventive vs Reactive Maintenance Costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="preventive" fill="#FF0B55" name="Preventive" />
                    <Bar dataKey="reactive" fill="#374151" name="Reactive" />
                    <Bar dataKey="savings" fill="#10B981" name="Savings" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Reliability Radar */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-['Urbanist']">Device Reliability Comparison</CardTitle>
                <CardDescription className="text-gray-400">
                  Multi-dimensional performance analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={reliabilityData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9CA3AF" />
                    <Radar name="Thermostat" dataKey="A" stroke="#FF0B55" fill="#FF0B55" fillOpacity={0.6} />
                    <Radar name="Camera" dataKey="B" stroke="#CF0F47" fill="#CF0F47" fillOpacity={0.6} />
                    <Radar name="Lock" dataKey="C" stroke="#FFDEDE" fill="#FFDEDE" fillOpacity={0.6} />
                    <Radar name="Sensor" dataKey="D" stroke="#FF6B9D" fill="#FF6B9D" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Failure Prediction Timeline */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-['Urbanist']">Failure Prediction Timeline</CardTitle>
              <CardDescription className="text-gray-400">
                AI-predicted component failure risks over next 90 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceMetrics.map((device) => {
                  const Icon = device.icon
                  const riskLevel = device.health < 60 ? "high" : device.health < 80 ? "medium" : "low"
                  const predictedFailure = Math.round((100 - device.health) * 0.9)
                  
                  return (
                    <div key={device.id} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-gray-400" />
                          <span className="text-white font-['Urbanist']">{device.name}</span>
                        </div>
                        <Badge variant="outline" className={getSeverityColor(riskLevel)}>
                          {riskLevel} risk
                        </Badge>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gray-700 rounded-full" />
                        <div 
                          className={`absolute inset-y-0 left-0 rounded-full ${
                            riskLevel === "high" ? "bg-red-500" : 
                            riskLevel === "medium" ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${predictedFailure}%` }}
                        />
                        <div className="relative flex justify-between text-xs text-gray-400 py-1 px-2">
                          <span>Today</span>
                          <span>{predictedFailure} days</span>
                          <span>90 days</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-['Urbanist']">Maintenance History</CardTitle>
                <Button variant="outline" size="sm" className="border-gray-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {maintenanceHistory.map((record) => (
                    <div key={record.id} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white font-['Urbanist'] font-medium">{record.type}</p>
                          <p className="text-gray-400 text-sm">{record.device}</p>
                        </div>
                        <Badge variant="outline" className="text-green-400 bg-green-900/20 border-green-800">
                          {record.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-gray-400 font-['IBM_Plex_Mono'] text-xs">DATE</p>
                          <p className="text-white">{record.date}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-['IBM_Plex_Mono'] text-xs">TECHNICIAN</p>
                          <p className="text-white">{record.technician}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-['IBM_Plex_Mono'] text-xs">DURATION</p>
                          <p className="text-white">{record.duration} min</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-['IBM_Plex_Mono'] text-xs">COST</p>
                          <p className="text-white">${record.cost}</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-700 pt-3">
                        <p className="text-gray-400 text-sm">{record.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Current Maintenance Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white font-['Urbanist']">Scheduled Maintenance</CardTitle>
            <CardDescription className="text-gray-400">Upcoming maintenance tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceTasks.filter(t => t.status !== 'completed').map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                    <div>
                      <p className="text-white font-medium font-['Urbanist']">{task.deviceName}</p>
                      <p className="text-gray-400 text-sm font-['IBM_Plex_Mono']">{task.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-white font-bold font-['Urbanist']">
                        {Math.ceil((task.scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                      </p>
                      <Badge variant="outline" className={`text-xs ${getSeverityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => completeMaintenance(task.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {maintenanceTasks.filter(t => t.status !== 'completed').length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-['Urbanist']">No scheduled maintenance</p>
                  <p className="text-gray-500 text-sm">All systems are up to date</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white font-['Urbanist']">Active Alerts</CardTitle>
            <CardDescription className="text-gray-400">Current system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-start space-x-3">
                    {alert.type === "error" ? (
                      <XCircle className="h-5 w-5 text-red-400 mt-0.5" />
                    ) : alert.type === "warning" ? (
                      <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-white text-sm font-['Urbanist']">{alert.message}</p>
                      <p className="text-gray-400 text-xs font-['IBM_Plex_Mono'] mt-1">
                        {alert.deviceName} • {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-400 font-['Urbanist']">No active alerts</p>
                  <p className="text-gray-500 text-sm">All systems operating normally</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Maintenance Dialog */}
      <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="font-['Urbanist']">Schedule Maintenance</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedInsight?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedInsight && (
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Device</span>
                  <span className="text-white font-['Urbanist']">{selectedInsight.affectedDevice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Duration</span>
                  <span className="text-white font-['Urbanist']">{selectedInsight.estimatedDowntime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cost Savings</span>
                  <span className="text-green-400 font-bold">{selectedInsight.costSavings}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-date" className="text-gray-400">Schedule Date</Label>
                <Input
                  id="schedule-date"
                  type="date"
                  className="bg-gray-800 border-gray-700"
                  defaultValue={format(addDays(new Date(), 2), 'yyyy-MM-dd')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician" className="text-gray-400">Assign Technician</Label>
                <Select defaultValue="auto">
                  <SelectTrigger id="technician" className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-assign</SelectItem>
                    <SelectItem value="john">John Smith</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-400">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special instructions..."
                  className="bg-gray-800 border-gray-700"
                  rows={3}
                />
              </div>

              {selectedInsight.automationAvailable && (
                <div className="flex items-center space-x-2 p-3 bg-gray-800 rounded-lg">
                  <input
                    type="checkbox"
                    id="auto-schedule"
                    checked={autoSchedule}
                    onChange={(e) => setAutoSchedule(e.target.checked)}
                    className="rounded border-gray-600"
                  />
                  <Label htmlFor="auto-schedule" className="text-gray-300 cursor-pointer">
                    Enable AI auto-scheduling for optimal timing
                  </Label>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMaintenanceDialogOpen(false)} className="border-gray-700">
              Cancel
            </Button>
            <Button onClick={handleConfirmSchedule} className="bg-[#FF0B55] hover:bg-[#E00A4D]">
              Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}