"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { User, Bell, Shield, Camera, Trash2, Save, Mail, Phone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import { userService } from "@/services/user.service"
import { propertyService } from "@/services/property.service"
import { toast } from "sonner"
import { useRef } from "react"

export default function BuyerSettingsPage() {
  const { user, checkAuth } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
  })

  // Password State
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Notifications State
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  })

  useEffect(() => {
    if (user) {
      const parts = user.name?.split(" ") || []
      setFormData({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: (user as any).phone || "",
        avatar: (user as any).avatar || "",
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      await userService.updateProfile({
        name: fullName,
        phone: formData.phone,
        avatar: formData.avatar,
      })
      await userService.updateNotifications({
        email: notifications.email,
        push: notifications.push,
        sms: notifications.sms,
      })
      await checkAuth()
      toast.success("Settings updated successfully")
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please fill in all password fields")
      return
    }

    try {
      setIsUpdatingPassword(true)
      await userService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      toast.success("Password updated successfully")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error: any) {
      console.error("Failed to update password:", error)
      toast.error(error.message || "Failed to update password")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploadingAvatar(true)
      const data = await propertyService.uploadSingleImage(file)
      setFormData(prev => ({ ...prev, avatar: data.url }))
      toast.success("Image uploaded. Remember to save your settings!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to upload avatar")
    } finally {
      setIsUploadingAvatar(false)
    }
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
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center relative border-2 border-border">
                        {formData.avatar ? (
                            <Image src={formData.avatar} alt="Avatar" fill className="object-cover" />
                        ) : (
                            <span className="font-heading font-bold text-3xl text-muted-foreground uppercase">{user?.name?.[0] || 'B'}</span>
                        )}
                        {isUploadingAvatar && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                    <Button
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-accent hover:bg-accent-hover text-primary z-10"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground capitalize">{user?.name || "Buyer Name"}</p>
                    <p className="text-sm text-muted-foreground capitalize">{user?.role || "User"}</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={() => fileInputRef.current?.click()} disabled={isUploadingAvatar}>
                      {isUploadingAvatar ? "Uploading..." : "Change Photo"}
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
                    <Input 
                        id="firstName" 
                        value={formData.firstName} 
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="mt-1.5" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                        id="lastName" 
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} 
                        className="mt-1.5" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    disabled 
                    className="mt-1.5 bg-muted/50" 
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} 
                    className="mt-1.5" 
                  />
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
                  <div className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-foreground">New Listings Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified when new properties match your saved search</p>
                    </div>
                    <Switch checked={notifications.email} onCheckedChange={(val) => setNotifications(prev => ({...prev, email: val}))} />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-foreground">Price Drops & Messages</p>
                      <p className="text-sm text-muted-foreground">Receive email notifications for messages and price drops</p>
                    </div>
                    <Switch checked={notifications.email} onCheckedChange={(val) => setNotifications(prev => ({...prev, email: val}))} />
                  </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Push Notifications</CardTitle>
                <CardDescription>Manage your push notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-foreground">Inspection Reminders (SMS/Push)</p>
                      <p className="text-sm text-muted-foreground">Reminders for upcoming property visits</p>
                    </div>
                    <Switch checked={notifications.sms} onCheckedChange={(val) => setNotifications(prev => ({...prev, sms: val}))} />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-foreground">Chat messages (Push)</p>
                      <p className="text-sm text-muted-foreground">Get notified of new chat messages</p>
                    </div>
                    <Switch checked={notifications.push} onCheckedChange={(val) => setNotifications(prev => ({...prev, push: val}))} />
                  </div>
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
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="mt-1.5" 
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="mt-1.5" 
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="mt-1.5" 
                  />
                </div>
                <Button 
                  onClick={handlePasswordChange}
                  disabled={isUpdatingPassword}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]"
                >
                  {isUpdatingPassword ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : "Update Password"}
                </Button>
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
