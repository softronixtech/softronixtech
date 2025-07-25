"use client"

import { useDashboard } from "@/contexts/dashboard-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Cpu,
  Camera,
  Lock,
  Thermometer,
  Lightbulb,
  Power,
  Settings,
  MapPin,
  Clock,
  Search,
  Wrench,
  Battery,
  Wifi,
} from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const deviceIcons = {
  thermostat: Thermometer,
  camera: Camera,
  lock: Lock,
  sensor: Cpu,
  lighting: Lightbulb,
}

export function DeviceControl() {
  const { devices, toggleDevice, configureDevice, scheduleMaintenance } = useDashboard()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "online" | "offline" | "maintenance">("all")
  const [selectedDevice, setSelectedDevice] = useState<any>(null)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false)
  const [deviceConfig, setDeviceConfig] = useState({
    name: "",
    location: "",
    firmwareVersion: "",
    updateInterval: "5",
    alertThreshold: "25",
  })
  const [maintenanceForm, setMaintenanceForm] = useState({
    type: "",
    scheduledDate: "",
    priority: "medium",
    assignedTo: "",
    estimatedDuration: "30",
    notes: "",
  })

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || device.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-400"
      case "offline":
        return "bg-red-400"
      case "maintenance":
        return "bg-yellow-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return "default"
      case "offline":
        return "destructive"
      case "maintenance":
        return "secondary"
      default:
        return "outline"
    }
  }

  const handleConfigureDevice = (device: any) => {
    setSelectedDevice(device)
    setDeviceConfig({
      name: device.name,
      location: device.location,
      firmwareVersion: device.firmwareVersion || "v1.0.0",
      updateInterval: "5",
      alertThreshold: "25",
    })
    setConfigDialogOpen(true)
  }

  const handleSaveConfig = () => {
    if (selectedDevice) {
      configureDevice(selectedDevice.id, {
        name: deviceConfig.name,
        location: deviceConfig.location,
        firmwareVersion: deviceConfig.firmwareVersion,
      })
      setConfigDialogOpen(false)
      setSelectedDevice(null)
    }
  }

  const handleScheduleMaintenance = (device: any) => {
    setSelectedDevice(device)
    setMaintenanceForm({
      type: "",
      scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split("T")[0],
      priority: "medium",
      assignedTo: "",
      estimatedDuration: "30",
      notes: "",
    })
    setMaintenanceDialogOpen(true)
  }

  const handleSaveMaintenance = () => {
    if (selectedDevice && maintenanceForm.type && maintenanceForm.scheduledDate) {
      scheduleMaintenance({
        deviceId: selectedDevice.id,
        deviceName: selectedDevice.name,
        type: maintenanceForm.type,
        scheduledDate: new Date(maintenanceForm.scheduledDate),
        priority: maintenanceForm.priority as "low" | "medium" | "high",
        status: "pending",
        assignedTo: maintenanceForm.assignedTo,
        estimatedDuration: Number.parseInt(maintenanceForm.estimatedDuration),
      })
      setMaintenanceDialogOpen(false)
      setSelectedDevice(null)
    }
  }

  const handleFirmwareUpdate = (deviceId: string) => {
    const newVersion = `v${Math.floor(Math.random() * 3) + 2}.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`
    configureDevice(deviceId, { firmwareVersion: newVersion })
  }

  const handleRestart = (deviceId: string) => {
    // Simulate device restart
    configureDevice(deviceId, { status: "maintenance" })
    setTimeout(() => {
      configureDevice(deviceId, { status: "online" })
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white font-['Urbanist'] mb-2">Unified Device Control</h1>
        <p className="text-gray-400">Monitor and control all connected IoT devices</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search devices or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <div className="flex gap-2">
          {["all", "online", "offline", "maintenance"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status as any)}
              className={filterStatus === status ? "bg-[#FF0B55] hover:bg-[#E00A4D]" : ""}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device) => {
          const IconComponent = deviceIcons[device.type as keyof typeof deviceIcons] || Cpu

          return (
            <Card
              key={device.id}
              className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r from-[#CF0F47] to-[#FF0B55] flex items-center justify-center`}
                    >
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white font-['Urbanist'] text-lg">{device.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(device.status)}`} />
                        <Badge variant={getStatusBadge(device.status) as any} className="text-xs">
                          {device.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={device.isActive}
                    onCheckedChange={() => toggleDevice(device.id)}
                    disabled={device.status === "maintenance"}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-center space-x-2 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-['IBM_Plex_Mono']">{device.location}</span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  {device.temperature && (
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Thermometer className="h-4 w-4 text-[#FF0B55]" />
                        <span className="text-xs text-gray-400 font-['IBM_Plex_Mono']">Temperature</span>
                      </div>
                      <p className="text-white font-bold font-['Urbanist']">{device.temperature.toFixed(1)}°C</p>
                    </div>
                  )}

                  {device.humidity && (
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-4 h-4 bg-blue-400 rounded-full" />
                        <span className="text-xs text-gray-400 font-['IBM_Plex_Mono']">Humidity</span>
                      </div>
                      <p className="text-white font-bold font-['Urbanist']">{device.humidity.toFixed(0)}%</p>
                    </div>
                  )}

                  {device.batteryLevel && (
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Battery className="h-4 w-4 text-green-400" />
                        <span className="text-xs text-gray-400 font-['IBM_Plex_Mono']">Battery</span>
                      </div>
                      <p className="text-white font-bold font-['Urbanist']">{device.batteryLevel.toFixed(0)}%</p>
                    </div>
                  )}

                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="h-4 w-4 text-green-400" />
                      <span className="text-xs text-gray-400 font-['IBM_Plex_Mono']">Uptime</span>
                    </div>
                    <p className="text-white font-bold font-['Urbanist']">{device.uptime.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Device Info */}
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400 font-['IBM_Plex_Mono']">Firmware</span>
                    <span className="text-xs text-white font-['IBM_Plex_Mono']">{device.firmwareVersion}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-['IBM_Plex_Mono']">Last Maintenance</span>
                    <span className="text-xs text-white font-['IBM_Plex_Mono']">
                      {device.lastMaintenance?.toLocaleDateString() || "Never"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                    onClick={() => handleConfigureDevice(device)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                    onClick={() => handleScheduleMaintenance(device)}
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    Maintain
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                    onClick={() => handleFirmwareUpdate(device.id)}
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    Update
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#FF0B55] text-[#FF0B55] hover:bg-[#FF0B55]/10 bg-transparent"
                    onClick={() => handleRestart(device.id)}
                  >
                    <Power className="h-4 w-4 mr-2" />
                    Restart
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredDevices.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-12">
            <Cpu className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 font-['Urbanist'] mb-2">No devices found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="font-['Urbanist']">Configure Device</DialogTitle>
            <DialogDescription className="text-gray-400">Update device settings and configuration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="device-name" className="text-gray-300">
                Device Name
              </Label>
              <Input
                id="device-name"
                value={deviceConfig.name}
                onChange={(e) => setDeviceConfig({ ...deviceConfig, name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-location" className="text-gray-300">
                Location
              </Label>
              <Input
                id="device-location"
                value={deviceConfig.location}
                onChange={(e) => setDeviceConfig({ ...deviceConfig, location: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firmware-version" className="text-gray-300">
                Firmware Version
              </Label>
              <Input
                id="firmware-version"
                value={deviceConfig.firmwareVersion}
                onChange={(e) => setDeviceConfig({ ...deviceConfig, firmwareVersion: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="update-interval" className="text-gray-300">
                Update Interval (minutes)
              </Label>
              <Select
                value={deviceConfig.updateInterval}
                onValueChange={(value) => setDeviceConfig({ ...deviceConfig, updateInterval: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveConfig}
              className="bg-gradient-to-r from-[#CF0F47] to-[#FF0B55] hover:from-[#B00D3F] hover:to-[#E00A4D]"
            >
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Maintenance Dialog */}
      <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="font-['Urbanist']">Schedule Maintenance</DialogTitle>
            <DialogDescription className="text-gray-400">
              Schedule maintenance for {selectedDevice?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maintenance-type" className="text-gray-300">
                Maintenance Type
              </Label>
              <Select
                value={maintenanceForm.type}
                onValueChange={(value) => setMaintenanceForm({ ...maintenanceForm, type: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select maintenance type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="routine-check">Routine Check</SelectItem>
                  <SelectItem value="firmware-update">Firmware Update</SelectItem>
                  <SelectItem value="hardware-repair">Hardware Repair</SelectItem>
                  <SelectItem value="calibration">Calibration</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="battery-replacement">Battery Replacement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduled-date" className="text-gray-300">
                Scheduled Date
              </Label>
              <Input
                id="scheduled-date"
                type="date"
                value={maintenanceForm.scheduledDate}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, scheduledDate: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-300">
                Priority
              </Label>
              <Select
                value={maintenanceForm.priority}
                onValueChange={(value) => setMaintenanceForm({ ...maintenanceForm, priority: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assigned-to" className="text-gray-300">
                Assigned To
              </Label>
              <Input
                id="assigned-to"
                value={maintenanceForm.assignedTo}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, assignedTo: e.target.value })}
                placeholder="Technician name"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated-duration" className="text-gray-300">
                Estimated Duration (minutes)
              </Label>
              <Input
                id="estimated-duration"
                type="number"
                value={maintenanceForm.estimatedDuration}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, estimatedDuration: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-300">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={maintenanceForm.notes}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
                placeholder="Additional notes or instructions"
                className="bg-gray-800 border-gray-700 text-white"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMaintenanceDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveMaintenance}
              className="bg-gradient-to-r from-[#CF0F47] to-[#FF0B55] hover:from-[#B00D3F] hover:to-[#E00A4D]"
            >
              Schedule Maintenance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
