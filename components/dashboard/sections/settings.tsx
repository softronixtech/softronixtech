"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, Palette, Database, Download, Upload, Trash2, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function Settings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || "",
      email: user?.email || "",
      company: "SoftronixTech",
      timezone: "UTC-5",
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      smsAlerts: false,
      maintenanceReminders: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "30",
      apiAccess: true,
    },
    appearance: {
      theme: "dark",
      language: "en",
      dateFormat: "MM/DD/YYYY",
    },
    system: {
      dataRetention: "90",
      autoBackup: true,
      debugMode: false,
    },
  })

  // Add state for showing save confirmation
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  // Update the handleSave function to be fully functional
  const handleSave = async () => {
    setSaveStatus("saving")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // Mock save to localStorage
      localStorage.setItem("softronix_settings", JSON.stringify(settings))
      setSaveStatus("saved")

      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  // Add handlers for data management buttons
  const handleExportData = (type: string) => {
    exportData(type)
  }

  const handleImportData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            importData(data)
          } catch (error) {
            console.error("Invalid JSON file")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      clearAllData()
    }
  }

  const exportData = (type: string) => {
    // Mock export functionality
    console.log(`Exporting data of type: ${type}`)
  }

  const importData = (data: any) => {
    // Mock import functionality
    console.log("Importing data:", data)
  }

  const clearAllData = () => {
    // Mock clear all data functionality
    console.log("Clearing all data")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white font-['Urbanist'] mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and system preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-[#FF0B55]" />
            <CardTitle className="text-white font-['Urbanist']">Profile Settings</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Update your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Full Name
              </Label>
              <Input
                id="name"
                value={settings.profile.name}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profile: { ...settings.profile, name: e.target.value },
                  })
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={settings.profile.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profile: { ...settings.profile, email: e.target.value },
                  })
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-300">
                Company
              </Label>
              <Input
                id="company"
                value={settings.profile.company}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profile: { ...settings.profile, company: e.target.value },
                  })
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-gray-300">
                Timezone
              </Label>
              <Select
                value={settings.profile.timezone}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    profile: { ...settings.profile, timezone: value },
                  })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                  <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                  <SelectItem value="UTC+0">UTC</SelectItem>
                  <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-[#FF0B55]" />
            <CardTitle className="text-white font-['Urbanist']">Notification Settings</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Configure how you receive alerts and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">Email Alerts</Label>
              <p className="text-sm text-gray-400">Receive device alerts via email</p>
            </div>
            <Switch
              checked={settings.notifications.emailAlerts}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, emailAlerts: checked },
                })
              }
            />
          </div>
          <Separator className="bg-gray-800" />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">Push Notifications</Label>
              <p className="text-sm text-gray-400">Browser push notifications</p>
            </div>
            <Switch
              checked={settings.notifications.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, pushNotifications: checked },
                })
              }
            />
          </div>
          <Separator className="bg-gray-800" />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">SMS Alerts</Label>
              <p className="text-sm text-gray-400">Critical alerts via SMS</p>
            </div>
            <Switch
              checked={settings.notifications.smsAlerts}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, smsAlerts: checked },
                })
              }
            />
          </div>
          <Separator className="bg-gray-800" />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">Maintenance Reminders</Label>
              <p className="text-sm text-gray-400">Scheduled maintenance notifications</p>
            </div>
            <Switch
              checked={settings.notifications.maintenanceReminders}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, maintenanceReminders: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-[#FF0B55]" />
            <CardTitle className="text-white font-['Urbanist']">Security Settings</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Manage your account security and access controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-400">Add an extra layer of security</p>
            </div>
            <Switch
              checked={settings.security.twoFactorAuth}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  security: { ...settings.security, twoFactorAuth: checked },
                })
              }
            />
          </div>
          <Separator className="bg-gray-800" />
          <div className="space-y-2">
            <Label htmlFor="session-timeout" className="text-gray-300">
              Session Timeout (minutes)
            </Label>
            <Select
              value={settings.security.sessionTimeout}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  security: { ...settings.security, sessionTimeout: value },
                })
              }
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator className="bg-gray-800" />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">API Access</Label>
              <p className="text-sm text-gray-400">Allow third-party API access</p>
            </div>
            <Switch
              checked={settings.security.apiAccess}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  security: { ...settings.security, apiAccess: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-[#FF0B55]" />
            <CardTitle className="text-white font-['Urbanist']">Appearance</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Customize the look and feel of your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-gray-300">
                Theme
              </Label>
              <Select
                value={settings.appearance.theme}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, theme: value },
                  })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="text-gray-300">
                Language
              </Label>
              <Select
                value={settings.appearance.language}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, language: value },
                  })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-format" className="text-gray-300">
                Date Format
              </Label>
              <Select
                value={settings.appearance.dateFormat}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, dateFormat: value },
                  })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-[#FF0B55]" />
            <CardTitle className="text-white font-['Urbanist']">System Settings</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Configure system behavior and data management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="data-retention" className="text-gray-300">
              Data Retention (days)
            </Label>
            <Select
              value={settings.system.dataRetention}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  system: { ...settings.system, dataRetention: value },
                })
              }
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator className="bg-gray-800" />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">Automatic Backup</Label>
              <p className="text-sm text-gray-400">Daily system backups</p>
            </div>
            <Switch
              checked={settings.system.autoBackup}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  system: { ...settings.system, autoBackup: checked },
                })
              }
            />
          </div>
          <Separator className="bg-gray-800" />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">Debug Mode</Label>
              <p className="text-sm text-gray-400">Enable detailed logging</p>
            </div>
            <Switch
              checked={settings.system.debugMode}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  system: { ...settings.system, debugMode: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white font-['Urbanist']">Data Management</CardTitle>
          <CardDescription className="text-gray-400">Export, import, and manage your system data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              onClick={() => handleExportData("all")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              onClick={handleImportData}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <Button
              variant="outline"
              className="border-red-700 text-red-400 hover:bg-red-900/20 bg-transparent"
              onClick={handleClearAllData}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className="bg-gradient-to-r from-[#CF0F47] to-[#FF0B55] hover:from-[#B00D3F] hover:to-[#E00A4D]"
        >
          <Save className="h-4 w-4 mr-2" />
          {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
