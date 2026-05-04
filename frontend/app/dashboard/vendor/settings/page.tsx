"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { User, Mail, Phone, MapPin, Building2, Camera, Bell, Shield, CreditCard, Trash2, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { userService, UserProfile } from "@/services/user.service"
import { propertyService } from "@/services/property.service"
import { toast } from "sonner"
import { useRef } from "react"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingKyc, setIsUploadingKyc] = useState(false)
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false)
  const [kycDocument, setKycDocument] = useState<{ url: string; publicId?: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")

  // Security
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Notifications
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const data = await userService.getProfile()
        setProfile(data)
        const nameParts = data.name.split(" ")
        setFirstName(nameParts[0] || "")
        setLastName(nameParts.slice(1).join(" ") || "")
        setPhone(data.phone || "")
        if (data.verificationDocument) {
          setKycDocument({
            url: data.verificationDocument,
            publicId: data.verificationDocPublicId,
          })
        }
      } catch (error) {
        console.error("Failed to fetch profile", error)
        toast.error("Could not lead profile data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await userService.updateProfile({ 
        name: `${firstName} ${lastName}`.trim(), 
        phone,
        avatar: profile?.avatar || ""
      })
      await userService.updateNotifications({
        email: notifications.email,
        push: notifications.push,
        sms: notifications.sms,
      })
      toast.success("Settings updated successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleKycUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setIsUploadingKyc(true)
      const uploaded = await propertyService.uploadSingleImage(file)
      setKycDocument({ url: uploaded.url, publicId: uploaded.publicId })
      toast.success("KYC file uploaded. Click submit to send for verification.")
    } catch (error) {
      toast.error("Failed to upload KYC file")
    } finally {
      setIsUploadingKyc(false)
    }
  }

  const handleKycSubmit = async () => {
    if (!kycDocument?.url) {
      toast.error("Upload a KYC document first")
      return
    }
    try {
      setIsSubmittingKyc(true)
      await userService.uploadKycDocument({
        verificationDocument: kycDocument.url,
        verificationDocPublicId: kycDocument.publicId,
      })
      toast.success("KYC submitted successfully. Admin will review your document.")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit KYC")
    } finally {
      setIsSubmittingKyc(false)
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match")
        return
    }
    if (!currentPassword || !newPassword) {
        toast.error("Please fill in all password fields")
        return
    }
    try {
        setIsChangingPassword(true)
        await userService.updatePassword({ currentPassword, newPassword })
        toast.success("Password updated successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
    } catch (e: any) {
        toast.error(e.response?.data?.message || "Failed to update password")
    } finally {
        setIsChangingPassword(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    try {
        setIsUploadingAvatar(true)
        const data = await propertyService.uploadSingleImage(file)
        setProfile({ ...profile, avatar: data.url })
        toast.success("Image uploaded. Remember to save your settings!")
    } catch (error) {
        console.error(error)
        toast.error("Failed to upload avatar")
    } finally {
        setIsUploadingAvatar(false)
    }
  }

  if (isLoading || !profile) {
      return (
          <div className="flex justify-center items-center h-[60vh]">
              <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
      )
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
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
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="w-4 h-4 hidden sm:block" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">KYC Verification</CardTitle>
                <CardDescription>Upload a verification document for admin approval</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Accepted documents: national ID, passport, or driver's license.
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <input type="file" accept="image/*,.pdf" onChange={handleKycUpload} />
                  {kycDocument?.url && (
                    <a
                      href={kycDocument.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline text-primary"
                    >
                      View uploaded document
                    </a>
                  )}
                </div>
                <Button onClick={handleKycSubmit} disabled={isUploadingKyc || isSubmittingKyc || !kycDocument?.url}>
                  {isUploadingKyc
                    ? "Uploading..."
                    : isSubmittingKyc
                    ? "Submitting..."
                    : "Submit KYC for Review"}
                </Button>
              </CardContent>
            </Card>

            {/* Avatar Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Profile Photo</CardTitle>
                <CardDescription>Update your profile picture</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center relative border-2 border-border bg-muted">
                        {profile?.avatar ? (
                            <Image src={profile.avatar} alt="Avatar" fill className="object-cover" />
                        ) : (
                            <span className="font-bold text-3xl text-primary capitalize">{(profile.name || "U")[0]}</span>
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
                    <p className="font-medium text-foreground">{profile.name}</p>
                    <p className="text-sm text-muted-foreground">{profile.role === 'admin' ? 'Admin' : 'Verified Agent'}</p>
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
                    <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input id="email" type="email" value={profile.email} disabled className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    defaultValue="Experienced real estate professional with over 8 years in the Lagos property market. Specializing in luxury residential properties in Lekki and Victoria Island."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-accent" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company">Company/Agency Name</Label>
                  <Input id="company" defaultValue="Prime Properties Nigeria" className="mt-1.5" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="license">License Number</Label>
                    <Input id="license" defaultValue="REA/2023/1234" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Specialization</Label>
                    <Select defaultValue="residential">
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="mixed">Mixed Use</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Office Address
                  </Label>
                  <Input id="address" defaultValue="15 Admiralty Way, Lekki Phase 1, Lagos" className="mt-1.5" />
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
                  <div className="flex items-center justify-between py-3 border-b last:border-0" key="NewLeadInquiries">
                    <div>
                      <p className="font-medium text-foreground">Lead Inquiries & Messages</p>
                      <p className="text-sm text-muted-foreground">Receive incoming emails about properties</p>
                    </div>
                    <Switch checked={notifications.email} onCheckedChange={(val) => setNotifications(prev => ({...prev, email: val}))} />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b last:border-0" key="WeeklyReports">
                    <div>
                      <p className="font-medium text-foreground">Weekly performance report</p>
                      <p className="text-sm text-muted-foreground">Receive a weekly summary of your property performance</p>
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
                  <div className="flex items-center justify-between py-3 border-b last:border-0" key="BookingReminders">
                    <div>
                      <p className="font-medium text-foreground">Inspection Reminders (SMS/Push)</p>
                      <p className="text-sm text-muted-foreground">Reminders for upcoming property visits</p>
                    </div>
                    <Switch checked={notifications.sms} onCheckedChange={(val) => setNotifications(prev => ({...prev, sms: val}))} />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b last:border-0" key="ChatMessagesPush">
                    <div>
                      <p className="font-medium text-foreground">Chat messages (Push)</p>
                      <p className="text-sm text-muted-foreground">Get notified of new chat messages</p>
                    </div>
                    <Switch checked={notifications.push} onCheckedChange={(val) => setNotifications(prev => ({...prev, push: val}))} />
                  </div>
              </CardContent>
            </Card>
            
            <Button onClick={handleSave} disabled={isSaving} className="w-full bg-accent hover:bg-accent-hover text-primary font-semibold mt-4">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Notifications"}
            </Button>
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
                  <Input id="currentPassword" type="password" className="mt-1.5" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" className="mt-1.5" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" className="mt-1.5" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <Button 
                    onClick={handlePasswordChange}
                    disabled={isChangingPassword}
                    className="bg-primary hover:bg-primary-light"
                >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">Use an authenticator app for additional security</p>
                  </div>
                  <Switch />
                </div>
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

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Current Plan</CardTitle>
                <CardDescription>Manage your subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-accent/10 border border-accent/20">
                  <div>
                    <p className="font-heading font-bold text-lg text-foreground">Pro Agent</p>
                    <p className="text-sm text-muted-foreground">₦25,000/month</p>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      <li>• Unlimited property listings</li>
                      <li>• Priority support</li>
                      <li>• Advanced analytics</li>
                    </ul>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Payment Method</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">**** **** **** 4532</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
                <Button variant="outline" className="w-full mt-4 gap-2 bg-transparent">
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
