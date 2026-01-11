"use client"

import { useState } from "react"
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

// Mock Users Data
const usersData = [
  {
    id: 1,
    name: "Golden Gate Agency",
    email: "contact@goldengate.com",
    role: "Vendor",
    status: "pending",
    joined: "Dec 12, 2025",
    avatar: "/placeholder-avatar.jpg",
  },
  {
    id: 2,
    name: "Chidi Okonkwo",
    email: "chidi.okonkwo@vantage.com",
    role: "Vendor",
    status: "verified",
    joined: "Nov 28, 2025",
    avatar: "/professional-nigerian-real-estate-agent-portrait.jpg",
  },
  {
    id: 3,
    name: "David Adeleke",
    email: "david.a@gmail.com",
    role: "Buyer",
    status: "active",
    joined: "Dec 10, 2025",
    avatar: "/nigerian-man-business-portrait.jpg",
  },
  {
    id: 4,
    name: "Lekki Gardens Ltd",
    email: "sales@lekkigardens.com",
    role: "Vendor",
    status: "suspended",
    joined: "Oct 15, 2025",
    avatar: "/placeholder-logo.jpg",
  },
  {
    id: 5,
    name: "Sarah Johnson",
    email: "s.johnson@yahoo.com",
    role: "Buyer",
    status: "active",
    joined: "Dec 05, 2025",
    avatar: "/nigerian-woman-professional-portrait.jpg",
  },
]

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "vendors") return matchesSearch && user.role === "Vendor"
    if (activeTab === "buyers") return matchesSearch && user.role === "Buyer"
    if (activeTab === "pending") return matchesSearch && user.status === "pending"
    
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={user.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{user.name}</span>
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="secondary" className="font-normal">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(user.status)}</td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{user.joined}</td>
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
                            {user.status === "pending" && (
                                <DropdownMenuItem className="cursor-pointer text-emerald-600 focus:text-emerald-700 bg-emerald-50 focus:bg-emerald-100">
                                    <ShieldCheck className="w-4 h-4 mr-2" /> Verify User
                                </DropdownMenuItem>
                            )}
                            {user.status !== "suspended" ? (
                                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                                    <UserX className="w-4 h-4 mr-2" /> Suspend
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem className="cursor-pointer text-emerald-600 focus:text-emerald-700">
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
