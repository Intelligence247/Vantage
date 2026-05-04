"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Building2, UserCheck, AlertCircle, ArrowUpRight, ArrowDownRight, MoreHorizontal, ShieldAlert, CheckCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { adminService, AdminStats } from "@/services/admin.service"
import { UserProfile } from "@/services/user.service"
import { Property } from "@/services/property.service"
import { toast } from "sonner"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function AdminDashboardOverview() {
  const [isLoading, setIsLoading] = useState(true)
  const [statsData, setStatsData] = useState<AdminStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([])
  const [pendingProperties, setPendingProperties] = useState<Property[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const stats = await adminService.getStats()
        const usersResponse = await adminService.getUsers(1, 5)
        const pendingResponse = await adminService.getPendingProperties(1, 5)
        setStatsData(stats)
        setRecentUsers(usersResponse.users)
        setPendingProperties(pendingResponse.properties)
      } catch (error) {
        console.error("Dashboard error:", error)
        toast.error("Failed to load admin metrics")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    {
      title: "Total Users",
      value: (statsData?.users.totalUsers || 0).toLocaleString(),
      change: "+2%",
      trend: "up",
      icon: Users,
      description: "active accounts",
    },
    {
      title: "Pending Action",
      value: (statsData?.users.pendingVerifications || 0).toString(),
      change: "+0%",
      trend: "up",
      icon: UserCheck,
      description: "awaiting approval",
      highlight: (statsData?.users.pendingVerifications || 0) > 0,
    },
    {
      title: "Total Properties",
      value: (statsData?.properties.totalProperties || 0).toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: Building2,
      description: "listed properties",
    },
    {
      title: "Pending Properties",
      value: (statsData?.properties.pendingProperties || 0).toString(),
      change: "+0",
      trend: "up",
      icon: AlertCircle,
      description: "awaiting review",
      highlight: (statsData?.properties.pendingProperties || 0) > 0,
    },
  ]

  if (isLoading) {
      return (
          <div className="flex justify-center flex-col items-center h-[70vh] gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">Loading global dashboard metrics...</p>
          </div>
      )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor system health, user verifications, and property listings.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className={`relative overflow-hidden ${stat.highlight ? "ring-2 ring-primary/20 shadow-lg shadow-primary/5" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.highlight ? "bg-primary/10" : "bg-muted"}`}>
                      <Icon className={`w-6 h-6 ${stat.highlight ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    {stat.change && (
                      <Badge variant="outline" className={`gap-1 ${stat.trend === 'up' ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-gray-600"}`}>
                        {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <div className="text-3xl font-bold font-heading text-foreground">{stat.value}</div>
                    <div className="text-sm font-medium text-muted-foreground mt-1">{stat.title}</div>
                    <div className="text-xs text-muted-foreground/70 mt-1">{stat.description}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Registrations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
            <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold">Recent Registrations</h2>
                <Button variant="outline" size="sm">View All Users</Button>
            </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id || user._id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                            <Badge variant="secondary" className="font-normal capitalize">
                                {user.role}
                            </Badge>
                        </td>
                        <td className="py-3 px-4">
                            {!user.isVerified ? (
                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 gap-1 shadow-none">
                                    <ShieldAlert className="w-3 h-3" /> Verify
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 gap-1">
                                    <CheckCircle className="w-3 h-3" /> Verified
                                </Badge>
                            )}
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground">{dayjs(user.createdAt).fromNow()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending Properties / Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
            <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold">Pending Review</h2>
            </div>
            {pendingProperties.length === 0 ? (
                <div className="text-center py-10 bg-muted/20 border border-dashed rounded-xl">
                    <p className="text-sm text-muted-foreground">No pending properties to review.</p>
                </div>
            ) : pendingProperties.map(property => (
                <Card key={property.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="relative h-32 bg-muted">
                        <Image
                            src={property.images?.[0]?.url || "/placeholder.svg"}
                            alt={property.title}
                            fill
                            className="object-cover"
                        />
                         {property.status === 'pending' && (
                            <div className="absolute top-2 right-2">
                                <Badge className="bg-amber-500 text-white shadow-sm">Pending Review</Badge>
                            </div>
                        )}
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-medium text-foreground truncate">{property.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{property.location?.type === 'Point' ? 'Geolocation set' : (property.city || property.address)}</p>
                        <div className="flex items-center justify-between pt-2 border-t">
                            <p className="font-bold text-foreground text-sm">
                              {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(property.price)}
                            </p>
                            <Button size="sm" variant="secondary" className="h-7 text-xs">Review</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
            
            <Card className="bg-primary text-primary-foreground mt-4">
                <CardContent className="p-6">
                    <h3 className="font-heading font-bold text-lg mb-2">System Health</h3>
                    <p className="text-sm text-primary-foreground/80 mb-4">All systems operational. Database latency is normal (24ms).</p>
                    <div className="flex gap-2">
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 w-[98%]"></div>
                        </div>
                    </div>
                    <p className="text-xs text-right mt-1 font-mono opacity-80">99.9% Uptime</p>
                </CardContent>
            </Card>
        </motion.div>
      </div>
    </div>
  )
}
