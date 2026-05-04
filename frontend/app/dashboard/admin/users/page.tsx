"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  MoreHorizontal,
  ShieldCheck,
  ShieldAlert,
  UserX,
  CheckCircle,
  Mail,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { adminService } from "@/services/admin.service"
import { UserProfile } from "@/services/user.service"
import { toast } from "sonner"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadUsers = async () => {
      try {
          setIsLoading(true)
          const data = await adminService.getUsers(1, 100) // load up to 100 for basic view
          setUsers(data.users)
      } catch (error) {
          console.error("Failed to load users:", error)
          toast.error("Error loading users")
      } finally {
          setIsLoading(false)
      }
  }

  useEffect(() => {
      loadUsers()
  }, [])

  const handleVerify = async (userId: string) => {
      if (!userId) return
      try {
          await adminService.verifyAgent(userId)
          toast.success("Agent verified successfully")
          loadUsers()
      } catch(e) {
          console.error(e)
          toast.error("Failed to verify user")
      }
  }

  const handleSuspend = async (userId: string, suspend: boolean) => {
      if (!userId) return
      try {
          await adminService.suspendUser(userId, suspend)
          toast.success(`User ${suspend ? 'suspended' : 'reactivated'} successfully`)
          loadUsers()
      } catch(e) {
          console.error(e)
          toast.error("Failed to update user status")
      }
  }

  const computeStatus = (user: any) => {
      if (user.status) return user.status // If backend includes it directly
      if (user.isSuspended) return "suspended"
      if (user.role === "agent" && !user.isVerified) return "pending"
      return user.isVerified ? "verified" : "active"
  }

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "vendors") return matchesSearch && user.role === "agent"
    if (activeTab === "buyers") return matchesSearch && (user.role === "buyer" || user.role === "user")
    if (activeTab === "pending") return matchesSearch && computeStatus(user) === "pending"
    
    return matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 gap-1 border-0 shadow-none">
            <ShieldCheck className="w-3 h-3" /> Verified
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
            Active
          </Badge>
        )
      case "pending":
          return (
            <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 gap-1 border-0 shadow-none">
              <ShieldAlert className="w-3 h-3" /> Pending Verif.
            </Badge>
          )
      case "suspended":
        return (
          <Badge variant="destructive" className="gap-1 shadow-none">
            <UserX className="w-3 h-3" /> Suspended
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts, verify agents, and handle permissions.
          </p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Mail className="w-4 h-4" /> Invite User
        </Button>
      </div>

      {/* Controls & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 md:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
                <TabsTrigger value="buyers">Buyers</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">User</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Joined</th>
                  <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan={5} className="py-12 text-center text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                        </td>
                    </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user: any) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={user.id || user._id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="uppercase">{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{user.name}</span>
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="secondary" className="font-normal capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(computeStatus(user))}</td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{dayjs(user.createdAt).format('MMM D, YYYY')}</td>
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Edit Profile</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {computeStatus(user) === "pending" && (
                                <DropdownMenuItem onClick={() => handleVerify(user.id || user._id)} className="cursor-pointer text-emerald-600 focus:text-emerald-700 bg-emerald-50 focus:bg-emerald-100">
                                    <ShieldCheck className="w-4 h-4 mr-2" /> Verify User
                                </DropdownMenuItem>
                            )}
                            {computeStatus(user) !== "suspended" ? (
                                <DropdownMenuItem onClick={() => handleSuspend(user.id || user._id, true)} className="cursor-pointer text-destructive focus:text-destructive">
                                    <UserX className="w-4 h-4 mr-2" /> Suspend
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => handleSuspend(user.id || user._id, false)} className="cursor-pointer text-emerald-600 focus:text-emerald-700">
                                    <CheckCircle className="w-4 h-4 mr-2" /> Reactivate
                                </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                    <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                            No users found matching your search.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
