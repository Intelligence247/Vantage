"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, MapPin, Bed, Bath, Square, Heart, SlidersHorizontal, Grid3X3, List, View } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const properties = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    location: "Victoria Island, Lagos",
    price: 450000000,
    type: "For Sale",
    beds: 5,
    baths: 6,
    sqft: 6500,
    image: "/modern-luxury-villa-lagos-nigeria.jpg",
    has360Tour: true,
    isVerified: true,
  },
  {
    id: 2,
    title: "Contemporary Penthouse",
    location: "Ikoyi, Lagos",
    price: 320000000,
    type: "For Sale",
    beds: 4,
    baths: 4,
    sqft: 4200,
    image: "/contemporary-penthouse-apartment-lagos.jpg",
    has360Tour: true,
    isVerified: true,
  },
  {
    id: 3,
    title: "Executive Duplex",
    location: "Lekki Phase 1, Lagos",
    price: 180000000,
    type: "For Sale",
    beds: 4,
    baths: 5,
    sqft: 3800,
    image: "/executive-duplex-house-lekki-lagos.jpg",
    has360Tour: false,
    isVerified: true,
  },
  {
    id: 4,
    title: "Waterfront Mansion",
    location: "Banana Island, Lagos",
    price: 850000000,
    type: "For Sale",
    beds: 7,
    baths: 8,
    sqft: 12000,
    image: "/waterfront-mansion-banana-island-lagos.jpg",
    has360Tour: true,
    isVerified: true,
  },
  {
    id: 5,
    title: "Smart Home Apartment",
    location: "Eko Atlantic, Lagos",
    price: 5500000,
    type: "For Rent",
    beds: 3,
    baths: 3,
    sqft: 2400,
    image: "/smart-home-apartment-eko-atlantic-lagos.jpg",
    has360Tour: true,
    isVerified: false,
  },
  {
    id: 6,
    title: "Garden Terrace House",
    location: "Maitama, Abuja",
    price: 280000000,
    type: "For Sale",
    beds: 5,
    baths: 5,
    sqft: 5200,
    image: "/garden-terrace-house-maitama-abuja.jpg",
    has360Tour: false,
    isVerified: true,
  },
  {
    id: 7,
    title: "Luxury Serviced Flat",
    location: "Asokoro, Abuja",
    price: 3200000,
    type: "For Rent",
    beds: 2,
    baths: 2,
    sqft: 1800,
    image: "/luxury-serviced-flat-asokoro-abuja.jpg",
    has360Tour: true,
    isVerified: true,
  },
  {
    id: 8,
    title: "Colonial Style Estate",
    location: "Old GRA, Port Harcourt",
    price: 195000000,
    type: "For Sale",
    beds: 6,
    baths: 6,
    sqft: 7200,
    image: "/colonial-style-estate-port-harcourt.jpg",
    has360Tour: false,
    isVerified: true,
  },
  {
    id: 9,
    title: "Beach View Condo",
    location: "Oniru, Lagos",
    price: 4800000,
    type: "For Rent",
    beds: 3,
    baths: 3,
    sqft: 2100,
    image: "/beach-view-condo-oniru-lagos.jpg",
    has360Tour: true,
    isVerified: true,
  },
]

const propertyTypes = ["All Types", "House", "Apartment", "Villa", "Penthouse", "Duplex", "Land"]
const priceRanges = ["Any Price", "Under ₦50M", "₦50M - ₦100M", "₦100M - ₦300M", "₦300M - ₦500M", "Above ₦500M"]
const bedOptions = ["Any Beds", "1+", "2+", "3+", "4+", "5+"]

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedPrice, setSelectedPrice] = useState("Any Price")
  const [selectedBeds, setSelectedBeds] = useState("Any Beds")
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all")
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const formatPrice = (price: number, type: string) => {
    if (type === "For Rent") {
      return `₦${(price / 1000000).toFixed(1)}M/year`
    }
    return `₦${(price / 1000000).toFixed(0)}M`
  }

  const filteredProperties = properties.filter((property) => {
    if (listingType === "sale" && property.type !== "For Sale") return false
    if (listingType === "rent" && property.type !== "For Rent") return false
    if (searchQuery && !property.location.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20">
        {/* Header Section */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="font-heading text-3xl lg:text-5xl font-bold text-white">Find Your Perfect Property</h1>
              <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto">
                Browse through thousands of verified listings across Nigeria
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-2 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 w-full">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by location, landmark, or property name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent focus:outline-none text-primary placeholder:text-muted-foreground"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 text-primary hover:bg-muted/50 rounded-xl transition-colors md:border-l border-border"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span className="font-medium">Filters</span>
                  </button>
                  <button className="w-full md:w-auto bg-accent text-primary px-8 py-3 rounded-xl font-semibold hover:bg-accent-hover transition-colors">
                    Search
                  </button>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border mt-2 pt-4 px-4 pb-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Property Type</label>
                        <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          {propertyTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Price Range</label>
                        <select
                          value={selectedPrice}
                          onChange={(e) => setSelectedPrice(e.target.value)}
                          className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          {priceRanges.map((range) => (
                            <option key={range} value={range}>
                              {range}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Bedrooms</label>
                        <select
                          value={selectedBeds}
                          onChange={(e) => setSelectedBeds(e.target.value)}
                          className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          {bedOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Listing Type</label>
                        <div className="flex gap-2">
                          {[
                            { value: "all", label: "All" },
                            { value: "sale", label: "Buy" },
                            { value: "rent", label: "Rent" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setListingType(option.value as typeof listingType)}
                              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                                listingType === option.value
                                  ? "bg-primary text-white"
                                  : "bg-muted/50 text-primary hover:bg-muted"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-primary">
                  {filteredProperties.length} Properties Found
                </h2>
                <p className="text-muted-foreground">Showing results for your search</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-5 h-5 text-primary" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5 text-primary" />
                  </button>
                </div>
                <select className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm">
                  <option>Sort by: Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                </select>
              </div>
            </div>

            {/* Properties Grid */}
            <div
              className={
                viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"
              }
            >
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link href={`/properties/${property.id}`}>
                    <div
                      className={`group bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 ${
                        viewMode === "list" ? "flex flex-col md:flex-row" : ""
                      }`}
                    >
                      {/* Image */}
                      <div
                        className={`relative overflow-hidden ${viewMode === "list" ? "md:w-80 h-48 md:h-auto" : "h-56"}`}
                      >
                        <Image
                          src={property.image || "/placeholder.svg"}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              property.type === "For Sale" ? "bg-primary text-white" : "bg-accent text-primary"
                            }`}
                          >
                            {property.type}
                          </span>
                          {property.has360Tour && (
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary flex items-center gap-1">
                              <View className="w-3 h-3" />
                              360°
                            </span>
                          )}
                        </div>
                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleFavorite(property.id)
                          }}
                          className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          aria-label="Add to favorites"
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors ${
                              favorites.includes(property.id) ? "fill-red-500 text-red-500" : "text-primary"
                            }`}
                          />
                        </button>
                        {/* Verified Badge */}
                        {property.isVerified && (
                          <div className="absolute bottom-4 left-4 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
                            Verified
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className={`p-5 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-heading font-bold text-lg text-primary group-hover:text-accent transition-colors">
                              {property.title}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{property.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex items-center gap-4 mt-4 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span className="text-sm">{property.beds} Beds</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            <span className="text-sm">{property.baths} Baths</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="w-4 h-4" />
                            <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                          <p className="font-heading text-xl font-bold text-accent">
                            {formatPrice(property.price, property.type)}
                          </p>
                          <span className="text-sm text-muted-foreground">View Details →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <button className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors">
                Load More Properties
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
