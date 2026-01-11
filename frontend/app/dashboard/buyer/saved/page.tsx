"use client"

import { useState } from "react"
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

// Mock saved properties data
const savedProperties = [
  {
    id: 1,
    title: "Luxury 4-Bedroom Duplex",
    location: "Lekki Phase 1, Lagos",
    price: "₦85,000,000",
    type: "For Sale",
    beds: 4,
    baths: 5,
    sqft: "450",
    image: "/modern-luxury-duplex-house-exterior-lagos.jpg",
    savedAt: "Dec 10, 2025",
  },
  {
    id: 2,
    title: "Modern 3-Bedroom Apartment",
    location: "Victoria Island, Lagos",
    price: "₦2,500,000/yr",
    type: "For Rent",
    beds: 3,
    baths: 3,
    sqft: "280",
    image: "/contemporary-penthouse-apartment-lagos.jpg",
    savedAt: "Dec 8, 2025",
  },
  {
    id: 3,
    title: "Executive 5-Bedroom Mansion",
    location: "Banana Island, Lagos",
    price: "₦450,000,000",
    type: "For Sale",
    beds: 5,
    baths: 7,
    sqft: "850",
    image: "/waterfront-mansion-banana-island-lagos.jpg",
    savedAt: "Dec 5, 2025",
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

export default function SavedHomesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProperties = savedProperties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          {filteredProperties.map((property, index) => (
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
                      className={
                        property.type === "For Sale"
                          ? "bg-accent text-primary"
                          : "bg-primary text-white"
                      }
                    >
                      {property.type}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white text-red-500"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-heading font-semibold text-foreground truncate">
                    {property.title}
                  </h3>
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
                    <span className="font-heading font-bold text-lg text-foreground">
                      {property.price}
                    </span>
                    <Link href={`/properties/${property.id}`}>
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
