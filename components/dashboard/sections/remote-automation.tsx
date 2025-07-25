"use client"

import { useState } from "react"
import { useDashboard } from "@/contexts/dashboard-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Zap, Plus, Settings, Play, Pause, Trash2, Clock, Thermometer, Activity, Bell, Power } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const conditionTypes = [
  { value: "temperature", label: "Temperature", icon: Thermometer },
  { value: "humidity", label: "Humidity", icon: Activity },
  { value: "time", label: "Time Schedule", icon: Clock },
  { value: "device_status", label: "Device Status", icon: Power },
]

const actionTypes = [
  { value: "notification", label: "Send Notification", icon: Bell },
  { value: "device_control", label: "Control Device", icon: Power },
  { value: "system_action", label: "System Action", icon: Settings },
]

export function RemoteAutomation() {
  const { automationRules, addAutomationRule, toggleAutomationRule, deleteAutomationRule } = useDashboard()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRule, setNewRule] = useState({
    name: "",
    condition: "",
    action: "",
    isActive: true,
  })

  const handleCreateRule = () => {
    if (newRule.name && newRule.condition && newRule.action) {
      addAutomationRule(newRule)
      setNewRule({ name: "", condition: "", action: "", isActive: true })
      setIsDialogOpen(false)
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-400" : "bg-gray-400"
  }

  const handleUseTemplate = (templateType: string) => {
    let templateData = {}

    switch (templateType) {
      case "climate":
        templateData = {
          name: "Climate Control Automation",
          condition: "Temperature > 25°C OR Humidity > 60%",
          action: "Adjust HVAC system and send notification",
          isActive: true,
        }
        break
      case "security":
        templateData = {
          name: "Security Alert System",
          condition: "Motion detected after 6 PM",
          action: "Lock all doors and alert security team",
          isActive: true,
        }
        break
      case "energy":
        templateData = {
          name: "Energy Optimization",
          condition: "No motion detected for 30 minutes",
          action: "Reduce lighting to 20% and lower HVAC",
          isActive: true,
        }
        break
    }

    addAutomationRule(templateData)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Urbanist'] mb-2">Remote Automation</h1>
          <p className="text-gray-400">Configure intelligent trigger-based actions and workflows</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#CF0F47] to-[#FF0B55] hover:from-[#B00D3F] hover:to-[#E00A4D]">
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="font-['Urbanist']">Create Automation Rule</DialogTitle>
              <DialogDescription className="text-gray-400">
                Set up intelligent triggers and actions for your IoT devices
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rule-name" className="text-gray-300">
                  Rule Name
                </Label>
                <Input
                  id="rule-name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="e.g., Temperature Alert System"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition" className="text-gray-300">
                  Condition
                </Label>
                <Textarea
                  id="condition"
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                  placeholder="e.g., Temperature > 25°C AND Humidity < 40%"
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="action" className="text-gray-300">
                  Action
                </Label>
                <Textarea
                  id="action"
                  value={newRule.action}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                  placeholder="e.g., Send alert notification AND Turn on HVAC system"
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newRule.isActive}
                  onCheckedChange={(checked) => setNewRule({ ...newRule, isActive: checked })}
                />
                <Label htmlFor="active" className="text-gray-300">
                  Activate rule immediately
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateRule}
                className="bg-gradient-to-r from-[#CF0F47] to-[#FF0B55] hover:from-[#B00D3F] hover:to-[#E00A4D]"
              >
                Create Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#CF0F47] to-[#FF0B55] rounded-lg flex items-center justify-center">
                <Thermometer className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium font-['Urbanist']">Temperature Control</p>
                <p className="text-gray-400 text-sm">3 active rules</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#CF0F47] to-[#FF0B55] rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium font-['Urbanist']">Scheduled Tasks</p>
                <p className="text-gray-400 text-sm">5 scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#CF0F47] to-[#FF0B55] rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium font-['Urbanist']">Alert System</p>
                <p className="text-gray-400 text-sm">2 active alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#CF0F47] to-[#FF0B55] rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium font-['Urbanist']">Energy Optimization</p>
                <p className="text-gray-400 text-sm">1 active rule</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white font-['Urbanist']">Active Automation Rules</CardTitle>
          <CardDescription className="text-gray-400">Manage your intelligent automation workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(rule.isActive)}`} />
                  <div className="flex-1">
                    <h3 className="text-white font-medium font-['Urbanist']">{rule.name}</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-start space-x-2">
                        <span className="text-xs text-gray-400 font-['IBM_Plex_Mono'] mt-0.5">IF:</span>
                        <p className="text-sm text-gray-300 font-['IBM_Plex_Mono']">{rule.condition}</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-xs text-gray-400 font-['IBM_Plex_Mono'] mt-0.5">THEN:</span>
                        <p className="text-sm text-gray-300 font-['IBM_Plex_Mono']">{rule.action}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={rule.isActive ? "default" : "secondary"}>
                    {rule.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAutomationRule(rule.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    {rule.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAutomationRule(rule.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rule Templates */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white font-['Urbanist']">Rule Templates</CardTitle>
          <CardDescription className="text-gray-400">
            Pre-configured automation templates for common scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Thermometer className="h-5 w-5 text-[#FF0B55]" />
                  <h3 className="text-white font-medium font-['Urbanist']">Climate Control</h3>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Automatically adjust HVAC based on temperature and occupancy
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-gray-600 bg-transparent"
                  onClick={() => handleUseTemplate("climate")}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Bell className="h-5 w-5 text-[#FF0B55]" />
                  <h3 className="text-white font-medium font-['Urbanist']">Security Alert</h3>
                </div>
                <p className="text-gray-400 text-sm mb-3">Send notifications when motion is detected after hours</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-gray-600 bg-transparent"
                  onClick={() => handleUseTemplate("security")}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Zap className="h-5 w-5 text-[#FF0B55]" />
                  <h3 className="text-white font-medium font-['Urbanist']">Energy Saver</h3>
                </div>
                <p className="text-gray-400 text-sm mb-3">Reduce power consumption during off-peak hours</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-gray-600 bg-transparent"
                  onClick={() => handleUseTemplate("energy")}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
