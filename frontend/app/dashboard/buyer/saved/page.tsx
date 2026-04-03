"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search,
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Trash2,
  ExternalLink,
  Grid3X3,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { propertyService, Property } from "@/services/property.service"
import { toast } from "sonner"
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

export default function SavedHomesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [savedProperties, setSavedProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSavedProperties = async () => {
    try {
      setIsLoading(true)
      const data = await propertyService.getFavorites(1, 100)
      setSavedProperties(data.properties)
    } catch (error) {
      console.error("Failed to load saved properties:", error)
      toast.error("Failed to load your saved properties")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedProperties()
  }, [])

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await propertyService.toggleFavorite(propertyId)
      setSavedProperties((prev) => prev.filter((p) => p._id !== propertyId))
      toast.success("Property removed from favorites")
    } catch (error) {
      console.error("Failed to remove favorite:", error)
      toast.error("An error occurred")
    }
  }

  const formatPrice = (price: number, currency: string = "₦") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace("NGN", currency)
  }

  const filteredProperties = savedProperties.filter(
    (property) =>
      property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">Saved Homes</h1>
          <p className="text-muted-foreground mt-1">
            {savedProperties.length} properties in your wishlist
          </p>
        </div>
        <Link href="/properties">
          <Button className="bg-accent hover:bg-accent-hover text-primary font-semibold gap-2 shadow-lg shadow-accent/20">
            <Search className="w-5 h-5" />
            Find More
          </Button>
        </Link>
      </motion.div>

      {/* Search & View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search saved properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex border rounded-lg overflow-hidden">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-primary" : ""}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-primary" : ""}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredProperties.map((property) => (
            <motion.div key={property._id} variants={itemVariants}>
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
                      className="bg-primary text-white capitalize"
                    >
                      For {property.status}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleRemoveFavorite(property._id)}
                      className="h-8 w-8 bg-white/90 hover:bg-white text-red-500"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-heading font-semibold text-foreground truncate">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{property.location?.address}, {property.location?.city}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property.bedrooms || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.bathrooms || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      {property.size || 0} {property.sizeUnit || 'sqm'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="font-heading font-bold text-lg text-foreground">
                      {formatPrice(property.price, property.currency)}
                    </span>
                    <Link href={`/properties/${property._id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ExternalLink className="w-4 h-4" />
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
            No saved homes yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Start browsing and save properties you love
          </p>
          <Link href="/properties">
            <Button className="bg-accent hover:bg-accent-hover text-primary font-semibold">
              Browse Properties
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  )
}
