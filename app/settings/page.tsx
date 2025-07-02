"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  BellOff,
  ExternalLink,
  Mail,
  Home,
  Star,
  Settings,
  Shield,
  FileText,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("settings")
  const [darkMode, setDarkMode] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    const savedNotifications = localStorage.getItem("pushNotifications") !== "false"

    setDarkMode(savedDarkMode)
    setPushNotifications(savedNotifications)

    // Apply dark mode to document
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const handleBackClick = () => {
    router.push("/")
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())

    // Apply dark mode to document
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleNotifications = () => {
    const newNotifications = !pushNotifications
    setPushNotifications(newNotifications)
    localStorage.setItem("pushNotifications", newNotifications.toString())
  }

  const handleEmailSupport = () => {
    const subject = encodeURIComponent("OneFi App Support Request")
    const body = encodeURIComponent(
      "Hi OneFi Team,\n\nI need help with:\n\n[Please describe your issue here]\n\nApp Version: 1.0.0\nDevice: [Your device info]\n\nThank you!",
    )
    window.open(`mailto:support@onefi.app?subject=${subject}&body=${body}`)
  }

  return (
    <div
      className={`min-h-screen relative w-full max-w-sm mx-auto transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`fixed top-0 w-full max-w-sm z-10 px-4 py-4 border-b transition-colors ${
          darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleBackClick}>
            <ArrowLeft className={`w-5 h-5 ${darkMode ? "text-gray-300" : "text-gray-700"}`} />
          </Button>
          <h1 className="text-xl font-semibold text-center">Settings</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 px-4 pb-20">
        {/* Display Settings */}
        <section className="mt-4 mb-6">
          <h2 className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Display</h2>
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className="p-0">
              <Button
                variant="ghost"
                onClick={toggleDarkMode}
                className={`w-full justify-between px-4 py-4 h-auto ${
                  darkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-blue-500 mr-3" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-500 mr-3" />
                  )}
                  <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Dark Mode</span>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Notifications Settings */}
        <section className="mb-6">
          <h2 className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Notifications</h2>
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className="p-0">
              <Button
                variant="ghost"
                onClick={toggleNotifications}
                className={`w-full justify-between px-4 py-4 h-auto ${
                  darkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  {pushNotifications ? (
                    <Bell className="w-5 h-5 text-blue-500 mr-3" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-400 mr-3" />
                  )}
                  <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Push Notifications</span>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={toggleNotifications} />
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Support & Legal */}
        <section className="mb-6">
          <h2 className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Support & Legal</h2>
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className="p-0">
              <Button
                variant="ghost"
                onClick={handleEmailSupport}
                className={`w-full justify-between px-4 py-4 h-auto ${
                  darkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-blue-500" />
                  <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Help Center</span>
                </div>
                <ExternalLink className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
              </Button>

              <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`} />

              <Button
                variant="ghost"
                onClick={() => window.open("https://onefi.app/privacy", "_blank")}
                className={`w-full justify-between px-4 py-4 h-auto ${
                  darkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-3 text-blue-500" />
                  <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Privacy Policy</span>
                </div>
                <ExternalLink className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
              </Button>

              <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`} />

              <Button
                variant="ghost"
                onClick={() => window.open("https://onefi.app/terms", "_blank")}
                className={`w-full justify-between px-4 py-4 h-auto ${
                  darkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-blue-500" />
                  <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Terms of Service</span>
                </div>
                <ExternalLink className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* App Version */}
        <section className="text-center">
          <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <p className="font-medium">OneFi v1.0.0</p>
            <p className="mt-1">Start your personal finance journey here</p>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <div
        className={`fixed bottom-0 w-full max-w-sm border-t transition-colors ${
          darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"
        }`}
      >
        <div className="grid grid-cols-3 h-16">
          <Button
            variant="ghost"
            onClick={() => {
              setActiveTab("home")
              router.push("/")
            }}
            className={`flex flex-col items-center justify-center h-full ${
              activeTab === "home" ? "text-blue-600" : darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("favorites")}
            className={`flex flex-col items-center justify-center h-full ${
              activeTab === "favorites" ? "text-blue-600" : darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Star className="w-5 h-5 mb-1" />
            <span className="text-xs">Favorites</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center justify-center h-full ${
              activeTab === "settings" ? "text-blue-600" : darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
