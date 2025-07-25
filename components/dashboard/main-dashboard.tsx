"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Overview } from "./sections/overview"
import { DeviceControl } from "./sections/device-control"
import { PredictiveMaintenance } from "./sections/predictive-maintenance"
import { DataVisualization } from "./sections/data-visualization"
import { RemoteAutomation } from "./sections/remote-automation"
import { SecureIntegrations } from "./sections/secure-integrations"
import { Settings } from "./sections/settings"

export function MainDashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <Overview />
      case "devices":
        return <DeviceControl />
      case "maintenance":
        return <PredictiveMaintenance />
      case "analytics":
        return <DataVisualization />
      case "automation":
        return <RemoteAutomation />
      case "integrations":
        return <SecureIntegrations />
      case "settings":
        return <Settings />
      default:
        return <Overview />
    }
  }

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 p-4 sm:p-6 overflow-auto min-w-0">
          <div className="w-full max-w-full">{renderSection()}</div>
        </main>
      </div>
    </div>
  )
}
