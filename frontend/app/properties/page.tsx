"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, MapPin, Bed, Bath, Square, Heart, SlidersHorizontal, Grid3X3, List, View, Loader2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { propertyService, Property, PaginatedProperties } from "@/services/property.service"

const propertyTypes = ["All Types", "flat", "duplex", "bungalow", "mansion", "land"]
const priceRanges = ["Any Price", "Under ₦50M", "₦50M - ₦100M", "₦100M - ₦300M", "₦300M - ₦500M", "Above ₦500M"]
const bedOptions = ["Any Beds", "1+", "2+", "3+", "4+", "5+"]

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  
  // API State
  const [propertiesData, setPropertiesData] = useState<PaginatedProperties | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedPrice, setSelectedPrice] = useState("Any Price")
  const [selectedBeds, setSelectedBeds] = useState("Any Beds")
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all")
  
  const [favorites, setFavorites] = useState<string[]>([])

  const fetchProperties = async () => {
    setIsLoading(true)
    try {
      // Map UI filters to backend query params
      const filters: any = {}
      if (searchQuery) filters.search = searchQuery
      if (listingType !== "all") filters.status = listingType
      if (selectedType !== "All Types") filters.type = selectedType
      
      if (selectedBeds !== "Any Beds") {
        filters.beds = parseInt(selectedBeds.replace('+', ''))
      }
      
      // Price parsing logic could go here based on ranges
      
      const data = await propertyService.getAll(filters)
      setPropertiesData(data)
    } catch (error) {
      console.error("Failed to fetch properties:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch and fetch on filter changes (excluding search query unless submitted)
  useEffect(() => {
    fetchProperties()
  }, [listingType, selectedType, selectedBeds, selectedPrice])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const formatPrice = (price: number, currency: string) => {
    if (price >= 1000000) {
      return `${currency} ${(price / 1000000).toFixed(1)}M`
    }
    return `${currency} ${price.toLocaleString()}`
  }

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
                  <button 
                    onClick={fetchProperties}
                    className="w-full md:w-auto bg-accent text-primary px-8 py-3 rounded-xl font-semibold hover:bg-accent-hover transition-colors">
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
                  {propertiesData?.total || 0} Properties Found
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
            {isLoading ? (
               <div className="flex justify-center py-20">
                 <Loader2 className="w-10 h-10 animate-spin text-primary" />
               </div>
            ) : (
                <div
                  className={
                    viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"
                  }
                >
                  {propertiesData?.properties.map((property, index) => (
                    <motion.div
                      key={property._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link href={`/properties/${property._id}`}>
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
                              src={property.images?.[0]?.url || "/placeholder.svg"}
                              alt={property.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                  property.status === "sale" ? "bg-primary text-white" : "bg-accent text-primary"
                                }`}
                              >
                                For {property.status}
                              </span>
                            </div>
                            {/* Favorite Button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                toggleFavorite(property._id)
                              }}
                              className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                              aria-label="Add to favorites"
                            >
                              <Heart
                                className={`w-5 h-5 transition-colors ${
                                  favorites.includes(property._id) ? "fill-red-500 text-red-500" : "text-primary"
                                }`}
                              />
                            </button>
                            {/* Verified Badge */}
                            {property.agent?.isVerified && (
                              <div className="absolute bottom-4 left-4 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
                                Verified Agent
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
                                  <span className="text-sm">{property.location.address}, {property.location.city}</span>
                                </div>
                              </div>
                            </div>

                            {/* Features */}
                            <div className="flex items-center gap-4 mt-4 text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Bed className="w-4 h-4" />
                                <span className="text-sm">{property.bedrooms} Beds</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Bath className="w-4 h-4" />
                                <span className="text-sm">{property.bathrooms} Baths</span>
                              </div>
                              {property.size && (
                                <div className="flex items-center gap-1">
                                  <Square className="w-4 h-4" />
                                  <span className="text-sm">{property.size} {property.sizeUnit}</span>
                                </div>
                              )}
                            </div>

                            {/* Price */}
                            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                              <p className="font-heading text-xl font-bold text-accent">
                                {formatPrice(property.price, property.currency)}
                              </p>
                              <span className="text-sm text-muted-foreground">View Details →</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
            )}

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
