"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Bed, Bath, Square, Heart, Eye } from "lucide-react"
import { propertyService, Property } from "@/services/property.service"

// We use the new Property interface from our service

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function PropertiesSection() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertyService.getFeatured(6)
        setProperties(data)
      } catch (error) {
        console.error("Failed to load properties", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProperties()
  }, [])

  return (
    <section className="py-24 lg:py-32 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Featured Listings</span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-4 tracking-tight">
              Discover Your Dream Home
            </h2>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
              Explore our handpicked selection of premium properties, verified for quality and value.
            </p>
          </div>
          <button className="self-start sm:self-auto border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-[0.98]">
            View All Properties
          </button>
        </motion.div>

        {/* Properties Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {isLoading ? (
             Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl h-[420px] animate-pulse">
                   <div className="h-[250px] bg-gray-200 rounded-t-2xl"></div>
                   <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                   </div>
                </div>
             ))
          ) : properties.map((property) => (
            <motion.div
              key={property._id}
              variants={itemVariants}
              className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-2px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={property.images?.[0]?.url || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-accent text-white text-xs font-medium px-3 py-1.5 rounded-full capitalize">
                    {property.status}
                  </span>
                  <span className="bg-primary/90 text-white text-xs font-medium px-3 py-1.5 rounded-full capitalize">
                    {property.type}
                  </span>
                </div>

                {/* Heart Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-secondary hover:text-red-500 hover:scale-110 transition-all duration-200">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Price */}
                <div className="text-accent font-heading text-2xl font-bold mb-2">
                  {property.currency} {property.price.toLocaleString()}
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-bold text-primary mb-2 line-clamp-1">{property.title}</h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location.address}, {property.location.city}</span>
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                    <Bath className="w-4 h-4" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  {property.size && (
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                      <Square className="w-4 h-4" />
                      <span>{property.size} {property.sizeUnit}</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link 
                  href={`/properties/${property._id}`}
                  className="w-full mt-6 border-2 border-primary text-primary py-3 flex justify-center rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-[0.98]">
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
