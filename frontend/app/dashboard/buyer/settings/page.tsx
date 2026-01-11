"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { User, Bell, Shield, Camera, Trash2, Save, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BuyerSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4 hidden sm:block" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4 hidden sm:block" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4 hidden sm:block" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Avatar Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Profile Photo</CardTitle>
                <CardDescription>Update your profile picture</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                        <span className="font-heading font-bold text-3xl text-muted-foreground">B</span>
                    </div>
                    <Button
                      size="icon"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-accent hover:bg-accent-hover text-primary"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Buyer Name</p>
                    <p className="text-sm text-muted-foreground">Verified User</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Change Photo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Tunde" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Bakare" className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input id="email" type="email" defaultValue="tunde.bakare@email.com" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input id="phone" defaultValue="+234 809 123 4567" className="mt-1.5" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-accent hover:bg-accent-hover text-primary font-semibold gap-2 min-w-[140px]"
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Email Notifications</CardTitle>
                <CardDescription>Manage your email notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: "New Listings Alerts",
                    description: "Get notified when new properties match your saved search",
                    default: true,
                  },
                  { label: "Price Drops", description: "Receive alerts when saved properties change price", default: true },
                  { label: "Messages", description: "Receive email notifications for new messages from agents", default: true },
                  {
                    label: "Newsletter",
                    description: "Weekly updates on the Nigerian real estate market",
                    default: false,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Push Notifications</CardTitle>
                <CardDescription>Manage your push notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: "Inspection Reminders",
                    description: "Reminders for upcoming property visits",
                    default: true,
                  },
                  { label: "Chat messages", description: "Get notified of new chat messages", default: true },
                  { label: "Recommended Properties", description: "Alerts for properties you might like", default: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" className="mt-1.5" />
                </div>
                <Button className="bg-primary hover:bg-primary-light text-white">Update Password</Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
