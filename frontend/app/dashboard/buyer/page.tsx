"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, MessageSquare, Search, MapPin, Bed, Bath, Maximize, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { propertyService, Property } from "@/services/property.service"
import { inquiryService } from "@/services/inquiry.service"
import { paymentService } from "@/services/payment.service"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"


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
  const { user } = useAuth()
  
  const [savedCount, setSavedCount] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [purchaseCount, setPurchaseCount] = useState(0)
  const [recommendedProps, setRecommendedProps] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const [favRes, inboxRes, propsRes, purchases] = await Promise.all([
          propertyService.getFavorites(1, 1),
          inquiryService.getInbox(1, 100),
          propertyService.getAll({ limit: 3 }),
          paymentService.getPurchases().catch(() => []),
        ])
        
        if (mounted) {
          setSavedCount(favRes.total || 0)
          setUnreadCount(inboxRes.total || 0) // Basic approximation
          setPurchaseCount(Array.isArray(purchases) ? purchases.length : 0)
          setRecommendedProps(propsRes.properties || [])
        }
      } catch (error) {
        console.error("Failed to load buyer overview", error)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchDashboardData()
    return () => { mounted = false }
  }, [])

  const formatPrice = (price: number, currency: string = "₦") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace("NGN", currency)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    )
  }

  const dynamicStats = [
    {
      title: "Saved Homes",
      value: savedCount.toString(),
      change: "Active",
      trend: "up",
      icon: Heart,
      description: "in your wishlist",
      highlight: true,
    },
    {
      title: "Active Inquiries",
      value: unreadCount.toString(),
      change: "New",
      trend: "up",
      icon: MessageSquare,
      description: "messages sent",
    },
    {
      title: "My purchases",
      value: purchaseCount.toString(),
      change: "Settled",
      trend: "up",
      icon: ShoppingBag,
      description: "completed checkouts",
      href: "/dashboard/buyer/purchases",
    },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground capitalize">Welcome back, {user?.name?.split(' ')[0] || 'Buyer'}</h1>
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
        {dynamicStats.map((stat) => {
          const Icon = stat.icon
          const card = (
            <Card
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg h-full ${
                stat.highlight ? "ring-2 ring-accent/50 shadow-accent/10" : ""
              } ${"href" in stat && stat.href ? "cursor-pointer" : ""}`}
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
          )
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              {"href" in stat && stat.href ? (
                <Link href={stat.href} className="block h-full">
                  {card}
                </Link>
              ) : (
                card
              )}
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
          {recommendedProps.map((property) => (
            <motion.div key={property.id} variants={itemVariants}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.images?.[0]?.url || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={property.type === "sale" ? "bg-accent text-primary" : "bg-primary text-white"}
                    >
                      {property.type === "sale" ? "For Sale" : property.type === "rent" ? "For Rent" : "Shortlet"}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white text-muted-foreground">
                        <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-heading font-semibold text-foreground truncate">{property.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{property.address || ''}, {property.city || ''}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property.beds || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.baths || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      {property.sqft || 0}m²
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="font-heading font-bold text-lg text-foreground">{formatPrice(property.price)}</span>
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
