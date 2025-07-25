"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Device {
  id: string
  name: string
  type: string
  status: "online" | "offline" | "maintenance"
  isActive: boolean
  temperature?: number
  humidity?: number
  uptime: number
  location: string
  lastMaintenance?: Date
  nextMaintenance?: Date
  firmwareVersion?: string
  batteryLevel?: number
}

interface Alert {
  id: string
  deviceId: string
  deviceName: string
  type: "warning" | "error" | "info"
  message: string
  timestamp: Date
  severity: "low" | "medium" | "high"
  acknowledged: boolean
}

interface AutomationRule {
  id: string
  name: string
  condition: string
  action: string
  isActive: boolean
  lastTriggered?: Date
  triggerCount: number
}

interface Integration {
  id: string
  name: string
  type: string
  status: "connected" | "disconnected" | "error"
  lastSync: Date
  connectionString?: string
  apiKey?: string
}

interface MaintenanceTask {
  id: string
  deviceId: string
  deviceName: string
  type: string
  scheduledDate: Date
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  assignedTo?: string
  estimatedDuration: number
}

interface DashboardContextType {
  devices: Device[]
  alerts: Alert[]
  automationRules: AutomationRule[]
  integrations: Integration[]
  maintenanceTasks: MaintenanceTask[]
  toggleDevice: (deviceId: string) => void
  configureDevice: (deviceId: string, config: any) => void
  addAutomationRule: (rule: Omit<AutomationRule, "id" | "triggerCount">) => void
  toggleAutomationRule: (ruleId: string) => void
  deleteAutomationRule: (ruleId: string) => void
  testIntegration: (integrationId: string) => void
  addIntegration: (integration: Omit<Integration, "id" | "lastSync">) => void
  removeIntegration: (integrationId: string) => void
  dismissAlert: (alertId: string) => void
  acknowledgeAlert: (alertId: string) => void
  scheduleMaintenance: (task: Omit<MaintenanceTask, "id">) => void
  completeMaintenance: (taskId: string) => void
  exportData: (type: string) => void
  importData: (data: any) => void
  clearAllData: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

// Enhanced mock data generators
const generateMockDevices = (): Device[] => [
  {
    id: "1",
    name: "Smart Thermostat - Office",
    type: "thermostat",
    status: "online",
    isActive: true,
    temperature: 22.5,
    humidity: 45,
    uptime: 98.5,
    location: "Office Building A",
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    nextMaintenance: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
    firmwareVersion: "v2.1.3",
    batteryLevel: 85,
  },
  {
    id: "2",
    name: "Security Camera - Entrance",
    type: "camera",
    status: "online",
    isActive: true,
    uptime: 99.2,
    location: "Main Entrance",
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    nextMaintenance: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
    firmwareVersion: "v1.8.2",
  },
  {
    id: "3",
    name: "Smart Lock - Conference Room",
    type: "lock",
    status: "offline",
    isActive: false,
    uptime: 87.3,
    location: "Conference Room 1",
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    nextMaintenance: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    firmwareVersion: "v3.0.1",
    batteryLevel: 23,
  },
  {
    id: "4",
    name: "Environmental Sensor - Lab",
    type: "sensor",
    status: "maintenance",
    isActive: true,
    temperature: 24.1,
    humidity: 52,
    uptime: 95.8,
    location: "Research Lab",
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    nextMaintenance: new Date(Date.now() + 1000 * 60 * 60 * 24 * 83),
    firmwareVersion: "v1.5.4",
    batteryLevel: 67,
  },
  {
    id: "5",
    name: "Smart Lighting - Warehouse",
    type: "lighting",
    status: "online",
    isActive: true,
    uptime: 96.7,
    location: "Warehouse Floor 1",
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    nextMaintenance: new Date(Date.now() + 1000 * 60 * 60 * 24 * 70),
    firmwareVersion: "v2.3.1",
  },
]

const generateMockAlerts = (): Alert[] => [
  {
    id: "1",
    deviceId: "4",
    deviceName: "Environmental Sensor - Lab",
    type: "warning",
    message: "Temperature threshold exceeded (24.1°C)",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    severity: "medium",
    acknowledged: false,
  },
  {
    id: "2",
    deviceId: "3",
    deviceName: "Smart Lock - Conference Room",
    type: "error",
    message: "Device offline for 2 hours",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    severity: "high",
    acknowledged: false,
  },
  {
    id: "3",
    deviceId: "1",
    deviceName: "Smart Thermostat - Office",
    type: "info",
    message: "Scheduled maintenance completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    severity: "low",
    acknowledged: true,
  },
  {
    id: "4",
    deviceId: "3",
    deviceName: "Smart Lock - Conference Room",
    type: "warning",
    message: "Battery level low (23%)",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30),
    severity: "medium",
    acknowledged: false,
  },
]

const generateMockAutomationRules = (): AutomationRule[] => [
  {
    id: "1",
    name: "Temperature Alert",
    condition: "Temperature > 25°C",
    action: "Send notification & adjust HVAC",
    isActive: true,
    lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 2),
    triggerCount: 15,
  },
  {
    id: "2",
    name: "Security Protocol",
    condition: "Motion detected after hours",
    action: "Lock all doors & alert security",
    isActive: true,
    lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 24),
    triggerCount: 3,
  },
  {
    id: "3",
    name: "Energy Optimization",
    condition: "No motion for 30 minutes",
    action: "Dim lights to 20%",
    isActive: false,
    lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 6),
    triggerCount: 42,
  },
]

const generateMockIntegrations = (): Integration[] => [
  {
    id: "1",
    name: "AWS IoT Core",
    type: "cloud",
    status: "connected",
    lastSync: new Date(Date.now() - 1000 * 60 * 5),
    connectionString: "iot.us-east-1.amazonaws.com",
    apiKey: "AKIA***************",
  },
  {
    id: "2",
    name: "Zigbee Network",
    type: "protocol",
    status: "connected",
    lastSync: new Date(Date.now() - 1000 * 60 * 2),
    connectionString: "zigbee://192.168.1.100:8080",
  },
  {
    id: "3",
    name: "MQTT Broker",
    type: "messaging",
    status: "connected",
    lastSync: new Date(Date.now() - 1000 * 60 * 1),
    connectionString: "mqtt://broker.softronixtech.com:1883",
  },
  {
    id: "4",
    name: "LoRaWAN Gateway",
    type: "protocol",
    status: "error",
    lastSync: new Date(Date.now() - 1000 * 60 * 30),
    connectionString: "lorawan://gateway.local:1700",
  },
]

const generateMockMaintenanceTasks = (): MaintenanceTask[] => [
  {
    id: "1",
    deviceId: "1",
    deviceName: "Smart Thermostat - Office",
    type: "Filter Replacement",
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    priority: "high",
    status: "pending",
    assignedTo: "John Smith",
    estimatedDuration: 30,
  },
  {
    id: "2",
    deviceId: "2",
    deviceName: "Security Camera - Entrance",
    type: "Lens Cleaning",
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    priority: "medium",
    status: "pending",
    assignedTo: "Sarah Johnson",
    estimatedDuration: 15,
  },
  {
    id: "3",
    deviceId: "4",
    deviceName: "Environmental Sensor - Lab",
    type: "Calibration",
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    priority: "low",
    status: "in-progress",
    assignedTo: "Mike Davis",
    estimatedDuration: 45,
  },
]

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(generateMockDevices())
  const [alerts, setAlerts] = useState<Alert[]>(generateMockAlerts())
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(generateMockAutomationRules())
  const [integrations, setIntegrations] = useState<Integration[]>(generateMockIntegrations())
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(generateMockMaintenanceTasks())

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prevDevices) =>
        prevDevices.map((device) => ({
          ...device,
          temperature: device.temperature ? device.temperature + (Math.random() - 0.5) * 2 : undefined,
          humidity: device.humidity ? device.humidity + (Math.random() - 0.5) * 5 : undefined,
          uptime: Math.max(0, device.uptime + (Math.random() - 0.1) * 0.5),
          batteryLevel: device.batteryLevel ? Math.max(0, device.batteryLevel + (Math.random() - 0.5) * 2) : undefined,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const toggleDevice = (deviceId: string) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              isActive: !device.isActive,
              status: device.isActive ? "offline" : "online",
            }
          : device,
      ),
    )

    // Add alert for device state change
    const device = devices.find((d) => d.id === deviceId)
    if (device) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        deviceId,
        deviceName: device.name,
        type: "info",
        message: `Device ${device.isActive ? "stopped" : "started"} by admin`,
        timestamp: new Date(),
        severity: "low",
        acknowledged: false,
      }
      setAlerts((prev) => [newAlert, ...prev])
    }
  }

  const configureDevice = (deviceId: string, config: any) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) => (device.id === deviceId ? { ...device, ...config } : device)),
    )

    // Add configuration alert
    const device = devices.find((d) => d.id === deviceId)
    if (device) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        deviceId,
        deviceName: device.name,
        type: "info",
        message: `Device configuration updated`,
        timestamp: new Date(),
        severity: "low",
        acknowledged: false,
      }
      setAlerts((prev) => [newAlert, ...prev])
    }
  }

  const addAutomationRule = (rule: Omit<AutomationRule, "id" | "triggerCount">) => {
    const newRule = {
      ...rule,
      id: Date.now().toString(),
      triggerCount: 0,
    }
    setAutomationRules((prev) => [...prev, newRule])

    // Add success alert
    const newAlert: Alert = {
      id: Date.now().toString(),
      deviceId: "system",
      deviceName: "Automation System",
      type: "info",
      message: `New automation rule "${rule.name}" created`,
      timestamp: new Date(),
      severity: "low",
      acknowledged: false,
    }
    setAlerts((prev) => [newAlert, ...prev])
  }

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules((prev) =>
      prev.map((rule) => (rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule)),
    )

    const rule = automationRules.find((r) => r.id === ruleId)
    if (rule) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        deviceId: "system",
        deviceName: "Automation System",
        type: "info",
        message: `Automation rule "${rule.name}" ${rule.isActive ? "disabled" : "enabled"}`,
        timestamp: new Date(),
        severity: "low",
        acknowledged: false,
      }
      setAlerts((prev) => [newAlert, ...prev])
    }
  }

  const deleteAutomationRule = (ruleId: string) => {
    const rule = automationRules.find((r) => r.id === ruleId)
    setAutomationRules((prev) => prev.filter((rule) => rule.id !== ruleId))

    if (rule) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        deviceId: "system",
        deviceName: "Automation System",
        type: "warning",
        message: `Automation rule "${rule.name}" deleted`,
        timestamp: new Date(),
        severity: "medium",
        acknowledged: false,
      }
      setAlerts((prev) => [newAlert, ...prev])
    }
  }

  const testIntegration = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? {
              ...integration,
              status: "connected",
              lastSync: new Date(),
            }
          : integration,
      ),
    )

    const integration = integrations.find((i) => i.id === integrationId)
    if (integration) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        deviceId: "system",
        deviceName: "Integration System",
        type: "info",
        message: `${integration.name} connection test successful`,
        timestamp: new Date(),
        severity: "low",
        acknowledged: false,
      }
      setAlerts((prev) => [newAlert, ...prev])
    }
  }

  const addIntegration = (integration: Omit<Integration, "id" | "lastSync">) => {
    const newIntegration = {
      ...integration,
      id: Date.now().toString(),
      lastSync: new Date(),
    }
    setIntegrations((prev) => [...prev, newIntegration])

    const newAlert: Alert = {
      id: Date.now().toString(),
      deviceId: "system",
      deviceName: "Integration System",
      type: "info",
      message: `New integration "${integration.name}" added`,
      timestamp: new Date(),
      severity: "low",
      acknowledged: false,
    }
    setAlerts((prev) => [newAlert, ...prev])
  }

  const removeIntegration = (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId)
    setIntegrations((prev) => prev.filter((i) => i.id !== integrationId))

    if (integration) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        deviceId: "system",
        deviceName: "Integration System",
        type: "warning",
        message: `Integration "${integration.name}" removed`,
        timestamp: new Date(),
        severity: "medium",
        acknowledged: false,
      }
      setAlerts((prev) => [newAlert, ...prev])
    }
  }

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const scheduleMaintenance = (task: Omit<MaintenanceTask, "id">) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
    }
    setMaintenanceTasks((prev) => [...prev, newTask])

    const newAlert: Alert = {
      id: Date.now().toString(),
      deviceId: task.deviceId,
      deviceName: task.deviceName,
      type: "info",
      message: `Maintenance scheduled: ${task.type}`,
      timestamp: new Date(),
      severity: "low",
      acknowledged: false,
    }
    setAlerts((prev) => [newAlert, ...prev])
  }

  const completeMaintenance = (taskId: string) => {
    const task = maintenanceTasks.find((t) => t.id === taskId)
    setMaintenanceTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: "completed" as const } : t)))

    if (task) {
      // Update device last maintenance date
      setDevices((prev) =>
        prev.map((d) =>
          d.id === task.deviceId
            ? {
                ...d,
                lastMaintenance: new Date(),
                nextMaintenance: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // 90 days from now
              }
            : d,
        ),
      )

      const newAlert: Alert = {
        id: Date.now().toString(),
        deviceId: task.deviceId,
        deviceName: task.deviceName,
        type: "info",
        message: `Maintenance completed: ${task.type}`,
        timestamp: new Date(),
        severity: "low",
        acknowledged: false,
      }
      setAlerts((prev) => [newAlert, ...prev])
    }
  }

  const exportData = (type: string) => {
    let data: any = {}

    switch (type) {
      case "devices":
        data = devices
        break
      case "alerts":
        data = alerts
        break
      case "automation":
        data = automationRules
        break
      case "all":
        data = { devices, alerts, automationRules, integrations, maintenanceTasks }
        break
      default:
        data = { devices, alerts, automationRules, integrations, maintenanceTasks }
    }

    // Simulate file download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `softronix-${type}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    const newAlert: Alert = {
      id: Date.now().toString(),
      deviceId: "system",
      deviceName: "Data Management",
      type: "info",
      message: `${type} data exported successfully`,
      timestamp: new Date(),
      severity: "low",
      acknowledged: false,
    }
    setAlerts((prev) => [newAlert, ...prev])
  }

  const importData = (data: any) => {
    // Mock import functionality
    console.log("Importing data:", data)

    const newAlert: Alert = {
      id: Date.now().toString(),
      deviceId: "system",
      deviceName: "Data Management",
      type: "info",
      message: `Data imported successfully`,
      timestamp: new Date(),
      severity: "low",
      acknowledged: false,
    }
    setAlerts((prev) => [newAlert, ...prev])
  }

  const clearAllData = () => {
    setDevices(generateMockDevices())
    setAlerts([])
    setAutomationRules([])
    setMaintenanceTasks([])

    const newAlert: Alert = {
      id: Date.now().toString(),
      deviceId: "system",
      deviceName: "Data Management",
      type: "warning",
      message: `All data cleared and reset to defaults`,
      timestamp: new Date(),
      severity: "high",
      acknowledged: false,
    }
    setAlerts((prev) => [newAlert])
  }

  return (
    <DashboardContext.Provider
      value={{
        devices,
        alerts,
        automationRules,
        integrations,
        maintenanceTasks,
        toggleDevice,
        configureDevice,
        addAutomationRule,
        toggleAutomationRule,
        deleteAutomationRule,
        testIntegration,
        addIntegration,
        removeIntegration,
        dismissAlert,
        acknowledgeAlert,
        scheduleMaintenance,
        completeMaintenance,
        exportData,
        importData,
        clearAllData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
