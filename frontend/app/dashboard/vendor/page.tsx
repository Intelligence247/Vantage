"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Eye, Building2, Users, TrendingUp, MoreHorizontal, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { propertyService, Property } from "@/services/property.service"
import { toast } from "sonner"



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

export default function DashboardOverview() {
  const { user } = useAuth()
  const [statsData, setStatsData] = useState<any>(null)
  const [recentListings, setRecentListings] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
      const loadDashboard = async () => {
          try {
              const [statsRes, propsRes] = await Promise.all([
                  propertyService.getAgentStats(),
                  propertyService.getAgentProperties(1, 5)
              ])
              setStatsData(statsRes)
              setRecentListings(propsRes.properties)
          } catch (error) {
              console.error("Dashboard error", error)
              toast.error("Failed to load dashboard data")
          } finally {
              setIsLoading(false)
          }
      }
      loadDashboard()
  }, [])

  const stats = [
    {
      title: "Total Views",
      value: statsData?.totalViews || 0,
      change: "+0%",
      trend: "up",
      icon: Eye,
      description: "overall",
    },
    {
      title: "Active Listings",
      value: statsData?.activeProperties || 0,
      change: `out of ${statsData?.totalProperties || 0} total`,
      trend: "neutral",
      icon: Building2,
      description: "properties live",
    },
    {
      title: "Total Leads",
      value: statsData?.totalLeads || 0,
      change: "+0%",
      trend: "up",
      icon: Users,
      description: "inquiries received",
      highlight: true,
    },
  ]

  // Format price
  const formatPrice = (price: number, type: string, paymentPeriod?: string) => {
    const amount = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);
    if (type === 'rent' || type === 'shortlet') {
        return paymentPeriod ? `${amount}/${paymentPeriod}` : `${amount}/yr`;
    }
    return amount;
  }

  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-[60vh]">
              <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
      )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0] || 'Agent'}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your properties today.</p>
        </div>
        <Link href="/dashboard/vendor/properties/new">
          <Button className="bg-accent hover:bg-accent-hover text-primary font-semibold gap-2 shadow-lg shadow-accent/20">
            <Plus className="w-5 h-5" />
            Post Property
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  stat.highlight ? "ring-2 ring-accent/50 shadow-accent/10" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                      <p
                        className={`font-heading text-3xl font-bold mt-2 ${
                          stat.highlight ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-emerald-500 text-sm font-medium flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {stat.change}
                        </span>
                        <span className="text-muted-foreground text-xs">{stat.description}</span>
                      </div>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        stat.highlight ? "bg-accent/10" : "bg-muted"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${stat.highlight ? "text-accent" : "text-muted-foreground"}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Recent Listings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="font-heading text-xl">Recent Listings</CardTitle>
            <Link href="/dashboard/vendor/properties">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
                View All
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Property</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Views</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentListings.map((listing) => (
                    <tr key={listing.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={listing.images?.[0]?.url || "/placeholder.svg"}
                              alt={listing.title}
                              width={64}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{listing.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{listing.city ? `${listing.city}, ${listing.state}` : listing.state}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-foreground">{formatPrice(listing.price, listing.type, listing.paymentPeriod)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          <span>{listing.views || 0}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={listing.status === "available" ? "default" : "secondary"}
                          className={
                            listing.status === "available"
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {listing.status ? listing.status.charAt(0).toUpperCase() + listing.status.slice(1) : ''}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/properties/${listing.id}`}>
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Eye className="w-4 h-4" />
                                View
                                </DropdownMenuItem>
                            </Link>
                            <Link href={`/dashboard/vendor/properties/${listing.id}/edit`}>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Pencil className="w-4 h-4" />
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {recentListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={listing.images?.[0]?.url || "/placeholder.svg"}
                      alt={listing.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{listing.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{listing.city ? `${listing.city}, ${listing.state}` : listing.state}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/properties/${listing.id}`}>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Eye className="w-4 h-4" />
                              View
                              </DropdownMenuItem>
                          </Link>
                          <Link href={`/dashboard/vendor/properties/${listing.id}/edit`}>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Pencil className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-semibold text-foreground text-sm">{formatPrice(listing.price, listing.type, listing.paymentPeriod)}</span>
                      <Badge
                        variant={listing.status === "available" ? "default" : "secondary"}
                        className={
                          listing.status === "available"
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {listing.status ? listing.status.charAt(0).toUpperCase() + listing.status.slice(1) : ''}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
