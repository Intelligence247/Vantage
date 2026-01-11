"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutGrid, Heart, MessageSquare, Calendar, Settings, LogOut, Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { name: "Overview", href: "/dashboard/buyer", icon: LayoutGrid },
  { name: "Saved Homes", href: "/dashboard/buyer/saved", icon: Heart },
  { name: "Inbox", href: "/dashboard/buyer/inbox", icon: MessageSquare, badge: 1 },
  { name: "My Visits", href: "/dashboard/buyer/visits", icon: Calendar },
  { name: "Settings", href: "/dashboard/buyer/settings", icon: Settings },
]

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/dashboard/buyer") return pathname === "/dashboard/buyer"
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary h-16 flex items-center justify-between px-4">
        <Link href="/dashboard/buyer" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="font-heading font-bold text-primary text-sm">V</span>
          </div>
          <span className="font-heading font-bold text-white text-lg">VANTAGE</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:bg-white/10"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-primary transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
              <span className="font-heading font-bold text-primary text-base">V</span>
            </div>
            <span className="font-heading font-bold text-white text-xl tracking-tight">VANTAGE</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                    ${
                      active
                        ? "bg-white/10 text-white shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full"
                    />
                  )}
                  <Icon className={`w-5 h-5 ${active ? "text-accent" : ""}`} />
                  <span className="font-medium">{link.name}</span>
                  {link.badge && (
                    <span className="ml-auto bg-accent text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20">
                {/* Placeholder Avatar for Buyer */}
                <div className="w-full h-full flex items-center justify-center bg-accent text-primary font-bold">
                  B
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">Buyer Name</p>
                <p className="text-white/50 text-xs truncate">Verified User</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/50" />
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/5"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">{children}</main>
    </div>
  )
}
