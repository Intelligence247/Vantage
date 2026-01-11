"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Eye, Building2, Users, TrendingUp, MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const stats = [
  {
    title: "Total Views",
    value: "12.4k",
    change: "+12%",
    trend: "up",
    icon: Eye,
    description: "vs last month",
  },
  {
    title: "Active Listings",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Building2,
    description: "properties live",
  },
  {
    title: "New Leads",
    value: "24",
    change: "+18%",
    trend: "up",
    icon: Users,
    description: "this week",
    highlight: true,
  },
]

const recentListings = [
  {
    id: 1,
    title: "Luxury 4-Bedroom Duplex",
    location: "Lekki Phase 1, Lagos",
    price: "₦85,000,000",
    status: "active",
    views: 342,
    image: "/modern-luxury-duplex-house-exterior-lagos.jpg",
  },
  {
    id: 2,
    title: "Modern 3-Bedroom Apartment",
    location: "Victoria Island, Lagos",
    price: "₦2,500,000/yr",
    status: "active",
    views: 218,
    image: "/contemporary-penthouse-apartment-lagos.jpg",
  },
  {
    id: 3,
    title: "Executive 5-Bedroom Mansion",
    location: "Banana Island, Lagos",
    price: "₦450,000,000",
    status: "sold",
    views: 567,
    image: "/waterfront-mansion-banana-island-lagos.jpg",
  },
]

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
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">Welcome back, Chidi</h1>
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
                              src={listing.image || "/placeholder.svg"}
                              alt={listing.title}
                              width={64}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{listing.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{listing.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-foreground">{listing.price}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          <span>{listing.views}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={listing.status === "active" ? "default" : "secondary"}
                          className={
                            listing.status === "active"
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {listing.status === "active" ? "Active" : "Sold"}
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
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Pencil className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
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
                      src={listing.image || "/placeholder.svg"}
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
                        <p className="text-sm text-muted-foreground truncate">{listing.location}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Pencil className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-semibold text-foreground text-sm">{listing.price}</span>
                      <Badge
                        variant={listing.status === "active" ? "default" : "secondary"}
                        className={
                          listing.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {listing.status === "active" ? "Active" : "Sold"}
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
