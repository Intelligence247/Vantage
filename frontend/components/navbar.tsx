"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { getDashboardPath, getLastKnownRole } from "@/lib/dashboard-routes"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, showMemberNav, isLoading, logout } = useAuth()

  const dashboardHref = getDashboardPath(user?.role ?? getLastKnownRole())

  const isAuthPage = pathname === "/login" || pathname === "/register"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/properties", label: "Buy" },
    { href: "/properties?type=rent", label: "Rent" },
    { href: "/sell", label: "Sell" },
    { href: "/agents", label: "Agents" },
  ]

  if (isAuthPage) return null

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl lg:text-3xl font-bold tracking-tight text-primary">VANTAGE</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-medium text-sm transition-colors duration-200 ${
                  pathname === link.href ? "text-accent" : "text-primary/80 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 sm:gap-3">
            {isLoading && !showMemberNav ? (
              <div className="h-9 w-40 rounded-md bg-muted/60 animate-pulse" aria-hidden />
            ) : showMemberNav ? (
              <>
                <Button variant="outline" size="sm" className="border-primary/25 shadow-none" asChild>
                  <Link href={dashboardHref}>
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => logout()}>
                  <LogOut className="size-4" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-primary" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/register">Post a property</Link>
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-primary"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-border"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`block font-medium py-2 transition-colors ${
                    pathname === link.href ? "text-accent" : "text-primary hover:text-accent"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border space-y-3">
                {isLoading && !showMemberNav ? (
                  <div className="h-11 w-full rounded-md bg-muted/60 animate-pulse" aria-hidden />
                ) : showMemberNav ? (
                  <>
                    <Button variant="outline" className="w-full border-primary/25" asChild>
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="size-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        logout()
                      }}
                    >
                      <LogOut className="size-4" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block text-center text-primary font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Button className="w-full" asChild>
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        Post a property
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
