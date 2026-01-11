"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import {
  LayoutGrid,
  Users,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Bell,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const navLinks = [
  { name: "Overview", href: "/dashboard/admin", icon: LayoutGrid },
  { name: "User Management", href: "/dashboard/admin/users", icon: Users, badge: 2 },
  { name: "Properties", href: "/dashboard/admin/properties", icon: Building2 },
  { name: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r shadow-sm flex flex-col
          transform lg:transform-none transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-foreground">
              ADMIN
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 mb-1 font-medium ${
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{link.name}</span>
                  {link.badge && (
                    <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-[10px]">
                      {link.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </Button>

          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users, properties, or logs..."
                className="pl-9 bg-background/50 border-muted-foreground/20 focus:bg-background transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
            </Button>
            
            <div className="h-8 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">Super Admin</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-primary/10">
                <AvatarImage src="/admin-avatar.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-muted/20 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
