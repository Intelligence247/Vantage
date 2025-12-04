"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Bed, Bath, Square, Heart, Eye } from "lucide-react"

const properties = [
  {
    id: 1,
    title: "Luxury 4 Bedroom Duplex",
    location: "Lekki Phase 1, Lagos",
    price: "₦85,000,000",
    beds: 4,
    baths: 5,
    sqft: "350 sqm",
    image: "/modern-luxury-duplex-house-exterior-lagos.jpg",
    has360: true,
    isNew: true,
  },
  {
    id: 2,
    title: "Executive 3 Bedroom Flat",
    location: "Victoria Island, Lagos",
    price: "₦45,000,000",
    beds: 3,
    baths: 3,
    sqft: "180 sqm",
    image: "/modern-apartment-building-nigeria-victoria-island.jpg",
    has360: true,
    isNew: false,
  },
  {
    id: 3,
    title: "Modern Smart Home",
    location: "Maitama, Abuja",
    price: "₦120,000,000",
    beds: 5,
    baths: 6,
    sqft: "500 sqm",
    image: "/luxury-smart-home-mansion-abuja-nigeria.jpg",
    has360: false,
    isNew: true,
  },
  {
    id: 4,
    title: "Waterfront Penthouse",
    location: "Banana Island, Lagos",
    price: "₦250,000,000",
    beds: 4,
    baths: 4,
    sqft: "280 sqm",
    image: "/luxury-penthouse-waterfront-banana-island-lagos.jpg",
    has360: true,
    isNew: false,
  },
  {
    id: 5,
    title: "Contemporary Townhouse",
    location: "Ikeja GRA, Lagos",
    price: "₦55,000,000",
    beds: 4,
    baths: 4,
    sqft: "250 sqm",
    image: "/modern-townhouse-ikeja-gra-lagos-nigeria.jpg",
    has360: false,
    isNew: false,
  },
  {
    id: 6,
    title: "Premium Office Space",
    location: "Central Business District, Abuja",
    price: "₦75,000,000",
    beds: 0,
    baths: 2,
    sqft: "400 sqm",
    image: "/modern-office-building-abuja-central-business-dist.jpg",
    has360: true,
    isNew: true,
  },
]

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
      ease: "easeOut",
    },
  },
}

export function PropertiesSection() {
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
          {properties.map((property) => (
            <motion.div
              key={property.id}
              variants={itemVariants}
              className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-2px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.has360 && (
                    <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      360° Tour
                    </span>
                  )}
                  {property.isNew && (
                    <span className="bg-accent text-white text-xs font-medium px-3 py-1.5 rounded-full">New</span>
                  )}
                </div>

                {/* Heart Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-secondary hover:text-red-500 hover:scale-110 transition-all duration-200">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Price */}
                <div className="text-accent font-heading text-2xl font-bold mb-2">{property.price}</div>

                {/* Title */}
                <h3 className="font-heading text-lg font-bold text-primary mb-2 line-clamp-1">{property.title}</h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  {property.beds > 0 && (
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                      <Bed className="w-4 h-4" />
                      <span>{property.beds} Beds</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                    <Bath className="w-4 h-4" />
                    <span>{property.baths} Baths</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                    <Square className="w-4 h-4" />
                    <span>{property.sqft}</span>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full mt-6 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-[0.98]">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
