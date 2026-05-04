"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, MapPin, Star, Building2, Phone, Mail, ArrowRight, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { userService, UserProfile } from "@/services/user.service"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

export default function AgentsDirectoryPage() {
  const [agents, setAgents] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let mounted = true
    const fetchAgents = async () => {
      try {
        setIsLoading(true)
        // Fetch all verified vendors
        const response = await userService.getAllUsers(1, 50, "vendor")
        if (mounted) {
            setAgents(response.users.filter(u => u.isVerified))
        }
      } catch (error) {
        console.error("Failed to load agents directory", error)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    fetchAgents()
    return () => { mounted = false }
  }, [])

  const filteredAgents = agents.filter(agent => 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0">
              Vantage Elite Network
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
              Find Your Perfect Real Estate Partner
            </h1>
            <p className="text-lg text-white/80">
              Connect with top-rated, verified agents across Nigeria to help you buy, sell, or rent your next property.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Search by agent or agency name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-6 text-lg rounded-2xl bg-white focus-visible:ring-2 focus-visible:ring-accent border-0 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Agents Grid Section */}
      <section className="py-16 md:py-24 container mx-auto px-6 max-w-7xl">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="w-12 h-12 animate-spin text-accent mb-4" />
                <p>Loading premier agents...</p>
            </div>
        ) : filteredAgents.length === 0 ? (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-foreground">No agents found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search query.</p>
            </div>
        ) : (
            <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
            {filteredAgents.map((agent) => (
                <motion.div key={agent._id} variants={itemVariants}>
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group border-border/50">
                    <CardContent className="p-0">
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                            {agent.avatar ? (
                                <Image
                                src={agent.avatar}
                                alt={agent.name}
                                fill
                                className="object-cover"
                                />
                            ) : (
                                <span className="font-heading font-bold text-2xl text-primary capitalize">{agent.name[0]}</span>
                            )}
                            </div>
                            <div>
                            <h3 className="font-heading font-bold text-xl text-foreground capitalize group-hover:text-primary transition-colors">
                                {agent.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 px-2 py-0.5 mt-1 border-0">
                                Verified Agent
                                </Badge>
                            </div>
                            </div>
                        </div>
                        </div>

                        <div className="space-y-3 mb-6">
                        {agent.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Phone className="w-4 h-4 text-primary" />
                            <span>{agent.phone}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Mail className="w-4 h-4 text-primary" />
                            <span className="truncate">{agent.email}</span>
                        </div>
                        </div>

                        <Link href={`/agents/${agent._id}`} className="block">
                        <Button className="w-full bg-primary hover:bg-primary-light text-white group-hover:bg-accent group-hover:text-primary transition-all">
                            View Full Profile
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        </Link>
                    </div>
                    </CardContent>
                </Card>
                </motion.div>
            ))}
            </motion.div>
        )}
      </section>
    </div>
  )
}
