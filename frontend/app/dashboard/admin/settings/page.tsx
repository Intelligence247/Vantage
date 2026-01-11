"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Shield,
  Bell,
  Lock,
  LogOut,
  Settings as SettingsIcon,
  CreditCard,
  Building,
  Save,
  AlertTriangle,
  Megaphone,
  Server,
  Activity,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and system configuration.</p>
      </motion.div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Update your personal information and public profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-24 h-24 border-4 border-muted">
                        <AvatarImage src="/admin-avatar.jpg" />
                        <AvatarFallback className="text-xl">AD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">Change Photo</Button>
                  </div>
                  <div className="grid gap-4 flex-1 w-full max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue="Admin User" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input id="title" defaultValue="Super Admin" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="admin@sovereignestate.ng" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Role Description</Label>
                        <Textarea id="bio" placeholder="Describe your role..." defaultValue="Responsible for system-wide oversight, user verification, and listings moderation." />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t pt-6">
                  <Button className="gap-2">
                      <Save className="w-4 h-4" /> Save Changes
                  </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6"
          >
             <Card>
                <CardHeader>
                    <CardTitle>Authentication</CardTitle>
                    <CardDescription>Manage your password and security questions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end border-t pt-6">
                     <Button>Update Password</Button>
                </CardFooter>
             </Card>

             <Card>
                 <CardHeader>
                     <CardTitle>Two-Factor Authentication</CardTitle>
                     <CardDescription>Add an extra layer of security to your admin account.</CardDescription>
                 </CardHeader>
                 <CardContent className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                         <div className="p-3 bg-primary/10 rounded-full">
                             <Shield className="w-6 h-6 text-primary" />
                         </div>
                         <div>
                             <p className="font-medium text-foreground">Authenticator App</p>
                             <p className="text-sm text-muted-foreground">Use an app like Google Authenticator to get codes.</p>
                         </div>
                     </div>
                     <Button variant="outline">Setup 2FA</Button>
                 </CardContent>
             </Card>
          </motion.div>
        </TabsContent>

        {/* System Settings (Admin Exclusive) */}
        <TabsContent value="system">
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6"
              >
                {/* Announcements */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-primary" />
                            Global Announcements
                        </CardTitle>
                        <CardDescription>Broadcast a message to all users on the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Announcement Title</Label>
                            <Input placeholder="e.g. Scheduled Maintenance" />
                        </div>
                        <div className="space-y-2">
                            <Label>Message Body</Label>
                            <Textarea placeholder="Write your message here..." rows={4} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="notify-email" />
                            <Label htmlFor="notify-email">Send as Email Notification</Label>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end border-t pt-6">
                         <Button className="bg-primary text-primary-foreground gap-2">
                             <Megaphone className="w-4 h-4" /> Broadcast
                         </Button>
                    </CardFooter>
                </Card>

                {/* System Health / Maintenance */}
                <Card className="border-amber-200 bg-amber-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-900">
                            <Server className="w-5 h-5" />
                            Platform Status
                        </CardTitle>
                        <CardDescription className="text-amber-700/80">Manage the availability of the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-100 shadow-sm">
                            <div className="space-y-0.5">
                                <Label className="text-base font-semibold text-foreground">Maintenance Mode</Label>
                                <p className="text-sm text-muted-foreground">Disable access for all non-admin users.</p>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-100 shadow-sm">
                            <div className="space-y-0.5">
                                <Label className="text-base font-semibold text-foreground">Debug Logging</Label>
                                <p className="text-sm text-muted-foreground">Enable verbose logging for troubleshooting.</p>
                            </div>
                             <Switch />
                        </div>
                    </CardContent>
                </Card>
                
                 {/* Audit Log Preview */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Recent System Logs
                                </CardTitle>
                                <CardDescription>View recent administrative actions.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Activity className="w-4 h-4" /> View Full Log
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                         <div className="rounded-md border m-6 mt-0">
                             <table className="w-full text-sm">
                                 <thead>
                                     <tr className="border-b bg-muted/50">
                                         <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Action</th>
                                         <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Admin</th>
                                         <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Time</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     <tr className="border-b transition-colors hover:bg-muted/50">
                                         <td className="p-4 align-middle">Verified User <span className="font-mono text-xs">#U-1245</span></td>
                                         <td className="p-4 align-middle">admin@sovereignestate.ng</td>
                                         <td className="p-4 align-middle text-right">2 mins ago</td>
                                     </tr>
                                     <tr className="border-b transition-colors hover:bg-muted/50">
                                         <td className="p-4 align-middle">Deleted Property <span className="font-mono text-xs">#P-8821</span></td>
                                         <td className="p-4 align-middle">admin@sovereignestate.ng</td>
                                         <td className="p-4 align-middle text-right">1 hour ago</td>
                                     </tr>
                                      <tr className="transition-colors hover:bg-muted/50">
                                         <td className="p-4 align-middle">Updated System Settings</td>
                                         <td className="p-4 align-middle">super_admin</td>
                                         <td className="p-4 align-middle text-right">5 hours ago</td>
                                     </tr>
                                 </tbody>
                             </table>
                         </div>
                    </CardContent>
                </Card>
            </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
