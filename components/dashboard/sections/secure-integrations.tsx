"use client"

import { useState, useEffect } from "react"
import { useDashboard } from "@/contexts/dashboard-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  Cloud,
  Wifi,
  Database,
  Lock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Plus,
  Activity,
  Key,
  Globe,
  Server,
  Zap,
  TrendingUp,
  TrendingDown,
  Info,
  Copy,
  Eye,
  EyeOff,
  Download,
  Upload,
  Terminal,
  Code,
  FileText,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Trash2,
  Edit,
  Play,
  Pause,
  MoreVertical,
  Clock,
  CheckCircle2,
  XCircle2,
  Loader2
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { format, subDays, subHours } from "date-fns"

// Enhanced integration types with more details
const integrationTypes = {
  cloud: { icon: Cloud, color: "from-blue-500 to-blue-600" },
  protocol: { icon: Wifi, color: "from-purple-500 to-purple-600" },
  messaging: { icon: Database, color: "from-green-500 to-green-600" },
  security: { icon: Lock, color: "from-red-500 to-red-600" },
  api: { icon: Globe, color: "from-orange-500 to-orange-600" },
  database: { icon: Server, color: "from-indigo-500 to-indigo-600" }
}

// Extended available integrations
const availableIntegrations = [
  {
    id: "aws-iot",
    name: "AWS IoT Core",
    type: "cloud",
    description: "Amazon Web Services IoT platform with Thing Shadow support",
    category: "Cloud Platform",
    features: ["Device Shadow", "Rules Engine", "Real-time Analytics"],
    pricing: "Pay per message",
    documentation: "https://aws.amazon.com/iot-core/",
    requiredFields: ["endpoint", "accessKeyId", "secretAccessKey", "region"]
  },
  {
    id: "azure-iot",
    name: "Azure IoT Hub",
    type: "cloud",
    description: "Microsoft Azure IoT cloud platform with device twins",
    category: "Cloud Platform",
    features: ["Device Twins", "Edge Computing", "Stream Analytics"],
    pricing: "Tiered pricing",
    documentation: "https://azure.microsoft.com/services/iot-hub/",
    requiredFields: ["connectionString", "hubName"]
  },
  {
    id: "google-iot",
    name: "Google Cloud IoT",
    type: "cloud",
    description: "Google Cloud IoT Core with Pub/Sub integration",
    category: "Cloud Platform",
    features: ["Pub/Sub", "BigQuery", "ML Integration"],
    pricing: "Volume-based",
    documentation: "https://cloud.google.com/iot-core",
    requiredFields: ["projectId", "registryId", "privateKey", "region"]
  },
  {
    id: "mqtt",
    name: "MQTT Broker",
    type: "protocol",
    description: "MQTT 3.1.1/5.0 protocol broker connection",
    category: "Messaging Protocol",
    features: ["QoS Levels", "Retained Messages", "Last Will"],
    pricing: "Self-hosted",
    documentation: "https://mqtt.org/",
    requiredFields: ["brokerUrl", "port", "username", "password", "clientId"]
  },
  {
    id: "modbus",
    name: "Modbus TCP/RTU",
    type: "protocol",
    description: "Industrial Modbus protocol for PLCs and sensors",
    category: "Industrial Protocol",
    features: ["TCP/RTU", "Multiple Slaves", "Register Mapping"],
    pricing: "Free",
    documentation: "https://modbus.org/",
    requiredFields: ["host", "port", "unitId", "protocol"]
  },
  {
    id: "opcua",
    name: "OPC UA Server",
    type: "protocol",
    description: "OPC Unified Architecture for industrial automation",
    category: "Industrial Protocol",
    features: ["Security", "Discovery", "Historical Data"],
    pricing: "License-based",
    documentation: "https://opcfoundation.org/",
    requiredFields: ["endpointUrl", "securityPolicy", "certificate"]
  },
  {
    id: "kafka",
    name: "Apache Kafka",
    type: "messaging",
    description: "Distributed streaming platform for high-throughput data",
    category: "Message Queue",
    features: ["Stream Processing", "Partitioning", "Replication"],
    pricing: "Self-hosted",
    documentation: "https://kafka.apache.org/",
    requiredFields: ["bootstrapServers", "topic", "consumerGroup"]
  },
  {
    id: "redis",
    name: "Redis Pub/Sub",
    type: "messaging",
    description: "In-memory data structure store with pub/sub",
    category: "Message Queue",
    features: ["Pub/Sub", "Persistence", "Clustering"],
    pricing: "Self-hosted",
    documentation: "https://redis.io/",
    requiredFields: ["host", "port", "password", "channel"]
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    type: "database",
    description: "Advanced open-source relational database",
    category: "Database",
    features: ["ACID Compliance", "JSON Support", "Time-series"],
    pricing: "Free",
    documentation: "https://postgresql.org/",
    requiredFields: ["host", "port", "database", "username", "password"]
  },
  {
    id: "influxdb",
    name: "InfluxDB",
    type: "database",
    description: "Time-series database optimized for IoT data",
    category: "Database",
    features: ["Time-series", "Retention Policies", "Continuous Queries"],
    pricing: "Freemium",
    documentation: "https://influxdata.com/",
    requiredFields: ["url", "token", "organization", "bucket"]
  },
  {
    id: "auth0",
    name: "Auth0",
    type: "security",
    description: "Identity management and authentication service",
    category: "Security",
    features: ["SSO", "MFA", "Social Login"],
    pricing: "User-based",
    documentation: "https://auth0.com/",
    requiredFields: ["domain", "clientId", "clientSecret"]
  },
  {
    id: "vault",
    name: "HashiCorp Vault",
    type: "security",
    description: "Secrets management and data protection",
    category: "Security",
    features: ["Secret Storage", "PKI", "Encryption as a Service"],
    pricing: "Enterprise",
    documentation: "https://vaultproject.io/",
    requiredFields: ["address", "token", "namespace"]
  }
]

// Mock active integrations with more detailed data
const mockActiveIntegrations = [
  {
    id: "int-1",
    name: "AWS IoT Core - Production",
    type: "cloud",
    status: "connected",
    connectionString: "iot.us-east-1.amazonaws.com",
    apiKey: "AKIA****************",
    lastSync: new Date(),
    created: subDays(new Date(), 45),
    config: {
      endpoint: "a1b2c3d4e5f6g7.iot.us-east-1.amazonaws.com",
      region: "us-east-1",
      shadowSync: true,
      batchSize: 100
    },
    metrics: {
      messagesPerMinute: 1250,
      avgLatency: 45,
      errorRate: 0.02,
      uptime: 99.95
    },
    health: {
      status: "healthy",
      lastCheck: new Date(),
      issues: []
    }
  },
  {
    id: "int-2",
    name: "MQTT Broker - Edge Gateway",
    type: "protocol",
    status: "connected",
    connectionString: "mqtt://broker.local:1883",
    apiKey: "mqtt-edge-token",
    lastSync: new Date(),
    created: subDays(new Date(), 30),
    config: {
      brokerUrl: "broker.local",
      port: 1883,
      qos: 1,
      cleanSession: false,
      keepAlive: 60
    },
    metrics: {
      messagesPerMinute: 3500,
      avgLatency: 12,
      errorRate: 0.01,
      uptime: 99.98
    },
    health: {
      status: "healthy",
      lastCheck: new Date(),
      issues: []
    }
  },
  {
    id: "int-3",
    name: "InfluxDB Time Series",
    type: "database",
    status: "warning",
    connectionString: "http://influx.local:8086",
    apiKey: "influx-write-token",
    lastSync: subHours(new Date(), 2),
    created: subDays(new Date(), 60),
    config: {
      url: "http://influx.local:8086",
      organization: "iot-org",
      bucket: "sensor-data",
      retentionDays: 30
    },
    metrics: {
      messagesPerMinute: 850,
      avgLatency: 95,
      errorRate: 0.08,
      uptime: 98.5
    },
    health: {
      status: "warning",
      lastCheck: new Date(),
      issues: ["High disk usage (85%)", "Slow query performance"]
    }
  },
  {
    id: "int-4",
    name: "Modbus Factory Sensors",
    type: "protocol",
    status: "error",
    connectionString: "modbus://192.168.1.100:502",
    apiKey: "N/A",
    lastSync: subHours(new Date(), 5),
    created: subDays(new Date(), 90),
    config: {
      host: "192.168.1.100",
      port: 502,
      unitId: 1,
      timeout: 5000
    },
    metrics: {
      messagesPerMinute: 0,
      avgLatency: 0,
      errorRate: 1,
      uptime: 0
    },
    health: {
      status: "error",
      lastCheck: new Date(),
      issues: ["Connection timeout", "Unable to reach device"]
    }
  }
]

// Performance data for charts
const generatePerformanceData = () => {
  const data = []
  for (let i = 23; i >= 0; i--) {
    const time = subHours(new Date(), i)
    data.push({
      time: format(time, "HH:mm"),
      messages: Math.floor(Math.random() * 2000 + 3000),
      latency: Math.floor(Math.random() * 50 + 20),
      errors: Math.floor(Math.random() * 50)
    })
  }
  return data
}

// Integration health distribution
const healthDistribution = [
  { name: "Healthy", value: 65, color: "#10B981" },
  { name: "Warning", value: 25, color: "#F59E0B" },
  { name: "Error", value: 10, color: "#EF4444" }
]

// Protocol usage stats
const protocolUsage = [
  { protocol: "MQTT", devices: 450, percentage: 35 },
  { protocol: "HTTP/REST", devices: 380, percentage: 30 },
  { protocol: "Modbus", devices: 250, percentage: 20 },
  { protocol: "OPC UA", devices: 120, percentage: 10 },
  { protocol: "CoAP", devices: 50, percentage: 5 }
]

export function SecureIntegrations() {
  const { integrations, testIntegration, addIntegration, removeIntegration } = useDashboard()
  
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [selectedIntegrationType, setSelectedIntegrationType] = useState<any>(null)
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({})
  const [testingConnection, setTestingConnection] = useState<{ [key: string]: boolean }>({})
  const [performanceData] = useState(generatePerformanceData())
  const [activeTab, setActiveTab] = useState("overview")
  const [configForm, setConfigForm] = useState<{ [key: string]: string }>({})
  
  // Combine mock data with dashboard integrations
  const allIntegrations = [...mockActiveIntegrations, ...integrations]

  useEffect(() => {
    // Simulate real-time metric updates
    const interval = setInterval(() => {
      allIntegrations.forEach(integration => {
        if (integration.metrics && integration.status === "connected") {
          integration.metrics.messagesPerMinute += Math.floor(Math.random() * 100 - 50)
          integration.metrics.messagesPerMinute = Math.max(0, integration.metrics.messagesPerMinute)
        }
      })
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "healthy":
        return CheckCircle
      case "disconnected":
        return XCircle
      case "error":
        return XCircle
      case "warning":
        return AlertCircle
      default:
        return AlertCircle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "healthy":
        return "text-green-400"
      case "disconnected":
        return "text-gray-400"
      case "error":
        return "text-red-400"
      case "warning":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const handleAddIntegration = (integration: any) => {
    setSelectedIntegrationType(integration)
    setAddDialogOpen(true)
    // Initialize form with required fields
    const form: { [key: string]: string } = {}
    integration.requiredFields.forEach((field: string) => {
      form[field] = ""
    })
    setConfigForm(form)
  }

  const handleConfirmAdd = () => {
    if (selectedIntegrationType) {
      const newIntegration = {
        name: `${selectedIntegrationType.name} - ${new Date().toLocaleDateString()}`,
        type: selectedIntegrationType.type,
        status: "connected",
        connectionString: configForm.endpoint || configForm.brokerUrl || configForm.host || "N/A",
        apiKey: configForm.apiKey || configForm.token || "mock-key-" + Date.now(),
        config: { ...configForm },
        metrics: {
          messagesPerMinute: 0,
          avgLatency: 0,
          errorRate: 0,
          uptime: 100
        },
        health: {
          status: "healthy",
          lastCheck: new Date(),
          issues: []
        }
      }
      
      addIntegration(newIntegration)
      setAddDialogOpen(false)
      setSelectedIntegrationType(null)
      setConfigForm({})
    }
  }

  const handleTestConnection = async (integrationId: string) => {
    setTestingConnection({ ...testingConnection, [integrationId]: true })
    
    // Simulate connection test
    setTimeout(() => {
      testIntegration(integrationId)
      setTestingConnection({ ...testingConnection, [integrationId]: false })
    }, 2000)
  }

  const handleConfigureIntegration = (integration: any) => {
    setSelectedIntegration(integration)
    setConfigDialogOpen(true)
  }

  const handleExportConfig = () => {
    const config = {
      integrations: allIntegrations.map(i => ({
        name: i.name,
        type: i.type,
        config: i.config || {},
        created: i.created
      })),
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'integrations-config.json'
    a.click()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const connectedCount = allIntegrations.filter(i => i.status === "connected" || i.status === "healthy").length
  const totalCount = allIntegrations.length
  const connectionHealth = totalCount > 0 ? (connectedCount / totalCount) * 100 : 0
  const totalMessages = allIntegrations.reduce((acc, i) => acc + (i.metrics?.messagesPerMinute || 0), 0)
  const avgLatency = allIntegrations.reduce((acc, i) => acc + (i.metrics?.avgLatency || 0), 0) / (connectedCount || 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Urbanist'] mb-2">Secure Integrations</h1>
          <p className="text-gray-400">Manage external platform connections and protocols</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleExportConfig}
            className="border-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
          <Button 
            className="bg-[#FF0B55] hover:bg-[#E00A4D]"
            onClick={() => setActiveTab("available")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 font-['IBM_Plex_Mono']">Active Connections</CardTitle>
            <Shield className="h-4 w-4 text-[#FF0B55]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-['Urbanist']">
              {connectedCount}/{totalCount}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {connectionHealth.toFixed(0)}% healthy
            </p>
            <Progress value={connectionHealth} className="h-1.5 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 font-['IBM_Plex_Mono']">Message Throughput</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-['Urbanist']">
              {totalMessages.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400 mt-1">messages/minute</p>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
              <span className="text-green-400">12% from last hour</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 font-['IBM_Plex_Mono']">Avg Latency</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-['Urbanist']">
              {avgLatency.toFixed(0)}ms
            </div>
            <p className="text-xs text-gray-400 mt-1">response time</p>
            <div className="flex items-center mt-2 text-xs">
              <TrendingDown className="h-3 w-3 text-green-400 mr-1" />
              <span className="text-green-400">5% improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 font-['IBM_Plex_Mono']">Security Status</CardTitle>
            <Lock className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400 font-['Urbanist']">Secure</div>
            <p className="text-xs text-gray-400 mt-1">All connections encrypted</p>
            <div className="flex items-center mt-2 text-xs">
              <CheckCircle className="h-3 w-3 text-green-400 mr-1" />
              <span className="text-green-400">TLS 1.3 enforced</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active Integrations</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-['Urbanist']">Performance Overview</CardTitle>
                <CardDescription className="text-gray-400">24-hour message flow and latency</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
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
                    <Area type="monotone" dataKey="messages" stroke="#FF0B55" fill="#FF0B55" fillOpacity={0.3} name="Messages" />
                    <Area type="monotone" dataKey="latency" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Latency (ms)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Health Distribution */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-['Urbanist']">Integration Health</CardTitle>
                <CardDescription className="text-gray-400">Current status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={healthDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {healthDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  {healthDistribution.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-400">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Protocol Usage */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-['Urbanist']">Protocol Usage</CardTitle>
              <CardDescription className="text-gray-400">Connected devices by protocol type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {protocolUsage.map((protocol) => (
                  <div key={protocol.protocol} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 font-['Urbanist']">{protocol.protocol}</span>
                      <span className="text-gray-400 font-['IBM_Plex_Mono']">{protocol.devices} devices</span>
                    </div>
                    <div className="relative">
                      <Progress value={protocol.percentage} className="h-2" />
                      <span className="absolute right-0 -top-5 text-xs text-gray-500">{protocol.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Integrations Tab */}
        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {allIntegrations.map((integration) => {
              const TypeInfo = integrationTypes[integration.type as keyof typeof integrationTypes]
              const IconComponent = TypeInfo?.icon || Shield
              const StatusIcon = getStatusIcon(integration.health?.status || integration.status)
              const isHealthy = integration.status === "connected" || integration.health?.status === "healthy"
              
              return (
                <Card key={integration.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${TypeInfo?.color || "from-gray-500 to-gray-600"} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-white font-['Urbanist'] mb-1">{integration.name}</h3>
                          <p className="text-gray-400 text-sm capitalize">{integration.type} Integration</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <div className="flex items-center space-x-1">
                              <StatusIcon className={`h-4 w-4 ${getStatusColor(integration.health?.status || integration.status)}`} />
                              <span className={getStatusColor(integration.health?.status || integration.status)}>
                                {integration.health?.status || integration.status}
                              </span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-400 font-['IBM_Plex_Mono']">
                              Created {integration.created ? format(integration.created, "MMM d, yyyy") : "Recently"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConfigureIntegration(integration)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIntegration(integration.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    {integration.metrics && (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <p className="text-xs text-gray-400 font-['IBM_Plex_Mono'] mb-1">THROUGHPUT</p>
                          <p className="text-lg font-bold text-white font-['Urbanist']">
                            {integration.metrics.messagesPerMinute.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">msg/min</p>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <p className="text-xs text-gray-400 font-['IBM_Plex_Mono'] mb-1">LATENCY</p>
                          <p className="text-lg font-bold text-white font-['Urbanist']">
                            {integration.metrics.avgLatency}ms
                          </p>
                          <p className="text-xs text-gray-500">average</p>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <p className="text-xs text-gray-400 font-['IBM_Plex_Mono'] mb-1">ERROR RATE</p>
                          <p className="text-lg font-bold text-white font-['Urbanist']">
                            {(integration.metrics.errorRate * 100).toFixed(2)}%
                          </p>
                          <p className="text-xs text-gray-500">last hour</p>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <p className="text-xs text-gray-400 font-['IBM_Plex_Mono'] mb-1">UPTIME</p>
                          <p className="text-lg font-bold text-white font-['Urbanist']">
                            {integration.metrics.uptime}%
                          </p>
                          <p className="text-xs text-gray-500">30 days</p>
                        </div>
                      </div>
                    )}

                    {/* Connection Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 font-['IBM_Plex_Mono'] mb-1">CONNECTION STRING</p>
                          <p className="text-sm text-white font-mono">{integration.connectionString}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(integration.connectionString)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 font-['IBM_Plex_Mono'] mb-1">API KEY</p>
                          <p className="text-sm text-white font-mono">
                            {showApiKey[integration.id] ? integration.apiKey : "••••••••••••••••"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowApiKey({ ...showApiKey, [integration.id]: !showApiKey[integration.id] })}
                            className="text-gray-400 hover:text-white"
                          >
                            {showApiKey[integration.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(integration.apiKey)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Health Issues */}
                    {integration.health?.issues && integration.health.issues.length > 0 && (
                      <Alert className="mb-4 bg-yellow-900/20 border-yellow-800">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <AlertDescription className="text-yellow-300">
                          <p className="font-medium mb-1">Active Issues:</p>
                          <ul className="list-disc list-inside text-sm">
                            {integration.health.issues.map((issue, idx) => (
                              <li key={idx}>{issue}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Last sync: {integration.lastSync.toLocaleTimeString()}</span>
                        </span>
                        {integration.health?.lastCheck && (
                          <span className="flex items-center space-x-1">
                            <Activity className="h-3 w-3" />
                            <span>Health check: {format(integration.health.lastCheck, "HH:mm:ss")}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestConnection(integration.id)}
                          disabled={testingConnection[integration.id]}
                          className="border-gray-700"
                        >
                          {testingConnection[integration.id] ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Test Connection
                            </>
                          )}
                        </Button>
                        {isHealthy ? (
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Available Integrations Tab */}
        <TabsContent value="available" className="space-y-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white font-['Urbanist']">Available Integrations</h2>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="cloud">Cloud Platforms</SelectItem>
                  <SelectItem value="protocol">Protocols</SelectItem>
                  <SelectItem value="messaging">Messaging</SelectItem>
                  <SelectItem value="database">Databases</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableIntegrations.map((integration) => {
                const TypeInfo = integrationTypes[integration.type as keyof typeof integrationTypes]
                const IconComponent = TypeInfo?.icon || Shield

                return (
                  <Card
                    key={integration.id}
                    className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${TypeInfo?.color || "from-gray-500 to-gray-600"} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium font-['Urbanist']">{integration.name}</h3>
                            <p className="text-gray-400 text-xs">{integration.category}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {integration.pricing}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4">{integration.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-xs text-gray-500 font-['IBM_Plex_Mono']">KEY FEATURES</p>
                        <div className="flex flex-wrap gap-2">
                          {integration.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-gray-400 hover:text-white p-0"
                          onClick={() => window.open(integration.documentation, '_blank')}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Docs
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#FF0B55] hover:bg-[#E00A4D]"
                          onClick={() => handleAddIntegration(integration)}
                        >
                          <Plus className="h-3 w-3 mr-2" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Message Volume Trends */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-['Urbanist']">Message Volume Trends</CardTitle>
                <CardDescription className="text-gray-400">Daily message count by integration type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { day: 'Mon', cloud: 45000, protocol: 38000, database: 12000 },
                    { day: 'Tue', cloud: 52000, protocol: 42000, database: 15000 },
                    { day: 'Wed', cloud: 48000, protocol: 41000, database: 13000 },
                    { day: 'Thu', cloud: 58000, protocol: 45000, database: 18000 },
                    { day: 'Fri', cloud: 62000, protocol: 48000, database: 20000 },
                    { day: 'Sat', cloud: 35000, protocol: 28000, database: 10000 },
                    { day: 'Sun', cloud: 32000, protocol: 25000, database: 8000 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="cloud" fill="#3B82F6" name="Cloud" />
                    <Bar dataKey="protocol" fill="#8B5CF6" name="Protocol" />
                    <Bar dataKey="database" fill="#10B981" name="Database" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Error Rate Analysis */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-['Urbanist']">Error Rate Analysis</CardTitle>
                <CardDescription className="text-gray-400">Integration errors over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
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
                    <Line 
                      type="monotone" 
                      dataKey="errors" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Errors"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Integration Performance Comparison */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-['Urbanist']">Performance Comparison</CardTitle>
              <CardDescription className="text-gray-400">Key metrics across all integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-gray-400 font-['IBM_Plex_Mono'] text-xs py-3">INTEGRATION</th>
                      <th className="text-right text-gray-400 font-['IBM_Plex_Mono'] text-xs py-3">THROUGHPUT</th>
                      <th className="text-right text-gray-400 font-['IBM_Plex_Mono'] text-xs py-3">LATENCY</th>
                      <th className="text-right text-gray-400 font-['IBM_Plex_Mono'] text-xs py-3">ERROR RATE</th>
                      <th className="text-right text-gray-400 font-['IBM_Plex_Mono'] text-xs py-3">UPTIME</th>
                      <th className="text-right text-gray-400 font-['IBM_Plex_Mono'] text-xs py-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allIntegrations.map((integration) => (
                      <tr key={integration.id} className="border-b border-gray-800/50">
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 bg-gradient-to-r ${
                              integrationTypes[integration.type as keyof typeof integrationTypes]?.color || "from-gray-500 to-gray-600"
                            } rounded flex items-center justify-center`}>
                              {(() => {
                                const TypeInfo = integrationTypes[integration.type as keyof typeof integrationTypes]
                                const Icon = TypeInfo?.icon || Shield
                                return <Icon className="h-4 w-4 text-white" />
                              })()}
                            </div>
                            <span className="text-white font-['Urbanist']">{integration.name}</span>
                          </div>
                        </td>
                        <td className="text-right text-gray-300 font-['IBM_Plex_Mono'] text-sm">
                          {integration.metrics?.messagesPerMinute.toLocaleString() || 0}/min
                        </td>
                        <td className="text-right text-gray-300 font-['IBM_Plex_Mono'] text-sm">
                          {integration.metrics?.avgLatency || 0}ms
                        </td>
                        <td className="text-right text-gray-300 font-['IBM_Plex_Mono'] text-sm">
                          {((integration.metrics?.errorRate || 0) * 100).toFixed(2)}%
                        </td>
                        <td className="text-right text-gray-300 font-['IBM_Plex_Mono'] text-sm">
                          {integration.metrics?.uptime || 0}%
                        </td>
                        <td className="text-right">
                          <Badge variant="outline" className={`text-xs ${
                            integration.status === "connected" ? "text-green-400 border-green-800" :
                            integration.status === "warning" ? "text-yellow-400 border-yellow-800" :
                            "text-red-400 border-red-800"
                          }`}>
                            {integration.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-900/20 rounded-lg">
                    <Shield className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-['Urbanist'] font-medium">SSL/TLS Status</h3>
                    <p className="text-green-400 text-sm">All connections secure</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Protocol Version</span>
                    <span className="text-white font-['IBM_Plex_Mono']">TLS 1.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Certificate Expiry</span>
                    <span className="text-white font-['IBM_Plex_Mono']">89 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-900/20 rounded-lg">
                    <Key className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-['Urbanist'] font-medium">API Security</h3>
                    <p className="text-green-400 text-sm">OAuth 2.0 enabled</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Tokens</span>
                    <span className="text-white font-['IBM_Plex_Mono']">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Rotation</span>
                    <span className="text-white font-['IBM_Plex_Mono']">7 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-900/20 rounded-lg">
                    <Lock className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-['Urbanist'] font-medium">Compliance</h3>
                    <p className="text-green-400 text-sm">GDPR compliant</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Data Encryption</span>
                    <span className="text-white font-['IBM_Plex_Mono']">AES-256</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Audit</span>
                    <span className="text-white font-['IBM_Plex_Mono']">30 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Events */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-['Urbanist']">Recent Security Events</CardTitle>
              <CardDescription className="text-gray-400">Authentication and access logs</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {[
                    { type: "success", message: "API key rotated for AWS IoT Core", time: "2 hours ago", icon: CheckCircle2 },
                    { type: "info", message: "New OAuth token generated for Azure IoT Hub", time: "5 hours ago", icon: Info },
                    { type: "warning", message: "Failed authentication attempt on MQTT Broker", time: "1 day ago", icon: AlertTriangle },
                    { type: "success", message: "SSL certificate renewed for all endpoints", time: "3 days ago", icon: CheckCircle2 },
                    { type: "info", message: "Security audit completed successfully", time: "1 week ago", icon: Shield },
                  ].map((event, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg">
                      <event.icon className={`h-5 w-5 mt-0.5 ${
                        event.type === "success" ? "text-green-400" :
                        event.type === "warning" ? "text-yellow-400" :
                        "text-blue-400"
                      }`} />
                      <div className="flex-1">
                        <p className="text-white text-sm">{event.message}</p>
                        <p className="text-gray-400 text-xs mt-1">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Integration Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-['Urbanist']">Add {selectedIntegrationType?.name}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Configure the connection settings for {selectedIntegrationType?.category}
            </DialogDescription>
          </DialogHeader>
          {selectedIntegrationType && (
            <div className="space-y-4">
              {selectedIntegrationType.requiredFields.map((field: string) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field} className="text-gray-300 capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  {field.includes('password') || field.includes('secret') || field.includes('key') ? (
                    <div className="relative">
                      <Input
                        id={field}
                        type={showApiKey[field] ? "text" : "password"}
                        value={configForm[field] || ""}
                        onChange={(e) => setConfigForm({ ...configForm, [field]: e.target.value })}
                        className="bg-gray-800 border-gray-700 pr-10"
                        placeholder={`Enter ${field}`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-7 w-7 text-gray-400 hover:text-white"
                        onClick={() => setShowApiKey({ ...showApiKey, [field]: !showApiKey[field] })}
                      >
                        {showApiKey[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  ) : field === 'protocol' ? (
                    <Select
                      value={configForm[field] || ""}
                      onValueChange={(value) => setConfigForm({ ...configForm, [field]: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select protocol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP</SelectItem>
                        <SelectItem value="rtu">RTU</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field}
                      type="text"
                      value={configForm[field] || ""}
                      onChange={(e) => setConfigForm({ ...configForm, [field]: e.target.value })}
                      className="bg-gray-800 border-gray-700"
                      placeholder={`Enter ${field}`}
                    />
                  )}
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-connect" defaultChecked />
                  <Label htmlFor="auto-connect" className="text-gray-300">
                    Connect automatically after adding
                  </Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="border-gray-700">
              Cancel
            </Button>
            <Button onClick={handleConfirmAdd} className="bg-[#FF0B55] hover:bg-[#E00A4D]">
              Add Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configure Integration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-['Urbanist']">Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update integration settings and connection parameters
            </DialogDescription>
          </DialogHeader>
          {selectedIntegration && (
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList className="bg-gray-800 border-gray-700">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Integration Name</Label>
                  <Input
                    value={selectedIntegration.name}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Connection String</Label>
                  <Input
                    value={selectedIntegration.connectionString}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">API Key</Label>
                  <div className="relative">
                    <Input
                      type={showApiKey.config ? "text" : "password"}
                      value={selectedIntegration.apiKey}
                      className="bg-gray-800 border-gray-700 pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-7 w-7 text-gray-400 hover:text-white"
                      onClick={() => setShowApiKey({ ...showApiKey, config: !showApiKey.config })}
                    >
                      {showApiKey.config ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                {selectedIntegration.config && Object.entries(selectedIntegration.config).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <Input
                      value={value as string}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="logs" className="space-y-4">
                <ScrollArea className="h-[200px] bg-gray-800 rounded-lg p-4">
                  <div className="space-y-2 font-mono text-xs">
                    <p className="text-green-400">[{new Date().toISOString()}] Connection established</p>
                    <p className="text-gray-400">[{new Date().toISOString()}] Authenticating...</p>
                    <p className="text-green-400">[{new Date().toISOString()}] Authentication successful</p>
                    <p className="text-gray-400">[{new Date().toISOString()}] Subscribing to topics...</p>
                    <p className="text-green-400">[{new Date().toISOString()}] Ready to receive messages</p>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)} className="border-gray-700">
              Cancel
            </Button>
            <Button className="bg-[#FF0B55] hover:bg-[#E00A4D]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}