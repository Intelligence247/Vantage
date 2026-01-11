"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Calendar, MessageSquare, Search, MapPin, Bed, Bath, Maximize, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
  {
    title: "Saved Homes",
    value: "12",
    change: "+2",
    trend: "up",
    icon: Heart,
    description: "new this week",
    highlight: true,
  },
  {
    title: "Upcoming Visits",
    value: "3",
    change: "Next: Tmrw",
    trend: "neutral",
    icon: Calendar,
    description: "confirmed inspections",
  },
  {
    title: "Unread Messages",
    value: "5",
    change: "New",
    trend: "up",
    icon: MessageSquare,
    description: "from agents",
  },
]

const recommendedProperties = [
  {
    id: 1,
    title: "Luxury 4-Bedroom Duplex",
    location: "Lekki Phase 1, Lagos",
    price: "₦85,000,000",
    type: "For Sale",
    status: "active",
    beds: 4,
    baths: 5,
    sqft: "450",
    image: "/modern-luxury-duplex-house-exterior-lagos.jpg",
  },
  {
    id: 2,
    title: "Modern 3-Bedroom Apartment",
    location: "Victoria Island, Lagos",
    price: "₦2,500,000/yr",
    type: "For Rent",
    status: "active",
    beds: 3,
    baths: 3,
    sqft: "280",
    image: "/contemporary-penthouse-apartment-lagos.jpg",
  },
  {
    id: 4,
    title: "Smart Home Apartment",
    location: "Eko Atlantic, Lagos",
    price: "₦120,000,000",
    type: "For Sale",
    status: "active",
    beds: 3,
    baths: 4,
    sqft: "320",
    image: "/smart-home-apartment-eko-atlantic-lagos.jpg",
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

export default function BuyerDashboardOverview() {
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
          <p className="text-muted-foreground mt-1">Find your next dream home today.</p>
        </div>
        <Link href="/properties">
          <Button className="bg-accent hover:bg-accent-hover text-primary font-semibold gap-2 shadow-lg shadow-accent/20">
            <Search className="w-5 h-5" />
            Browse Properties
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-10"
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
                        <span className={`text-sm font-medium flex items-center gap-1 ${
                            stat.trend === 'up' ? 'text-emerald-500' : 'text-blue-500'
                        }`}>
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

      {/* Recommended Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-foreground">Recommended for You</h2>
            <Link href="/properties">
                <Button variant="ghost" className="text-accent hover:text-accent-hover gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                </Button>
            </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {recommendedProperties.map((property) => (
            <motion.div key={property.id} variants={itemVariants}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={property.type === "For Sale" ? "bg-accent text-primary" : "bg-primary text-white"}
                    >
                      {property.type}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white text-red-500 hover:text-red-600">
                        <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-heading font-semibold text-foreground truncate">{property.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{property.location}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      {property.sqft}m²
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="font-heading font-bold text-lg text-foreground">{property.price}</span>
                    <Link href={`/properties/${property.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                            View Details
                        </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
