"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Shield,
  Phone,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  View,
  Check,
  Home,
  Zap,
  Waves,
  TreePine,
  ShieldCheck,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// Sample property data
const propertyData = {
  id: 1,
  title: "Modern Luxury Villa with Panoramic Views",
  location: "Victoria Island, Lagos",
  address: "Plot 24, Adeola Odeku Street, Victoria Island, Lagos",
  price: 450000000,
  type: "For Sale",
  beds: 5,
  baths: 6,
  sqft: 6500,
  parking: 4,
  yearBuilt: 2022,
  has360Tour: true,
  isVerified: true,
  description: `This magnificent luxury villa represents the pinnacle of contemporary Nigerian architecture. Situated in the prestigious Victoria Island neighborhood, this property offers an unparalleled living experience with breathtaking panoramic views of the Lagos skyline.

The residence features an open-plan design with floor-to-ceiling windows that flood the interior with natural light. The gourmet kitchen is equipped with top-of-the-line appliances and custom cabinetry. Each bedroom is generously sized with en-suite bathrooms featuring premium fixtures.

The outdoor space includes a stunning infinity pool, landscaped gardens, and multiple entertainment areas perfect for hosting guests. Smart home technology is integrated throughout, allowing complete control of lighting, climate, and security systems.`,
  features: [
    "Smart Home Automation",
    "Infinity Swimming Pool",
    "Home Theater",
    "Wine Cellar",
    "Gym & Fitness Center",
    "Staff Quarters",
    "Backup Generator",
    "Water Treatment System",
    "CCTV Security System",
    "Landscaped Gardens",
    "Double Garage",
    "Rooftop Terrace",
  ],
  images: [
    "/modern-luxury-villa-lagos-nigeria.jpg",
    "/luxury-villa-living-room-interior.jpg",
    "/modern-kitchen-with-island-counter.jpg",
    "/canyon-village-storage/image4.png",
    "/infinity-pool-city.png",
    "/luxurious-home-theater.png",
  ],
  agent: {
    name: "Adebayo Okonkwo",
    title: "Senior Property Consultant",
    phone: "+234 802 345 6789",
    email: "adebayo@vantage.ng",
    image: "/professional-nigerian-real-estate-agent-portrait.jpg",
    verified: true,
    listings: 45,
    experience: "8 years",
  },
  nearbyPlaces: [
    { name: "Victoria Island Shopping Mall", distance: "0.5 km" },
    { name: "Lagos Country Club", distance: "1.2 km" },
    { name: "International School Lagos", distance: "2.0 km" },
    { name: "EKO Hospital", distance: "1.8 km" },
  ],
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Smart Home Automation": Zap,
  "Infinity Swimming Pool": Waves,
  "Home Theater": Home,
  "Wine Cellar": Home,
  "Gym & Fitness Center": Home,
  "Staff Quarters": Home,
  "Backup Generator": Zap,
  "Water Treatment System": Waves,
  "CCTV Security System": ShieldCheck,
  "Landscaped Gardens": TreePine,
  "Double Garage": Car,
  "Rooftop Terrace": Home,
}

export default function PropertyDetailPage() {
  const params = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)

  const property = propertyData

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const formatPrice = (price: number) => {
    return `₦${(price / 1000000).toFixed(0)}M`
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20">
        {/* Breadcrumb */}
        <div className="bg-muted/30 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link href="/properties" className="text-muted-foreground hover:text-primary transition-colors">
                Properties
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-primary font-medium">{property.title}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              {/* Main Image */}
              <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src={property.images[currentImageIndex] || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-primary" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-primary" />
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold">
                    {property.type}
                  </span>
                  {property.has360Tour && (
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-primary flex items-center gap-2">
                      <View className="w-4 h-4" />
                      360° Tour Available
                    </span>
                  )}
                  {property.isVerified && (
                    <span className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    aria-label="Add to favorites"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-primary"}`} />
                  </button>
                  <button
                    className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    aria-label="Share property"
                  >
                    <Share2 className="w-5 h-5 text-primary" />
                  </button>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {property.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      currentImageIndex === index ? "ring-2 ring-accent ring-offset-2" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img || "/placeholder.svg"} alt={`View ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Property Details */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="font-heading text-3xl lg:text-4xl font-bold text-primary">{property.title}</h1>
                  <div className="flex items-center gap-2 mt-3 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                    <span>{property.address}</span>
                  </div>
                  <p className="mt-4 text-3xl font-bold text-accent">{formatPrice(property.price)}</p>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                >
                  {[
                    { icon: Bed, label: "Bedrooms", value: property.beds },
                    { icon: Bath, label: "Bathrooms", value: property.baths },
                    { icon: Square, label: "Square Feet", value: property.sqft.toLocaleString() },
                    { icon: Car, label: "Parking", value: property.parking },
                  ].map((stat, index) => (
                    <div key={index} className="bg-muted/30 rounded-xl p-4 text-center">
                      <stat.icon className="w-6 h-6 text-accent mx-auto" />
                      <p className="mt-2 font-heading text-xl font-bold text-primary">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
                >
                  <h2 className="font-heading text-xl font-bold text-primary mb-4">About This Property</h2>
                  <div className="prose prose-slate max-w-none">
                    {property.description.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>

                {/* Features & Amenities */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
                >
                  <h2 className="font-heading text-xl font-bold text-primary mb-6">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.features.map((feature, index) => {
                      const IconComponent = amenityIcons[feature] || Check
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-accent" />
                          </div>
                          <span className="text-sm font-medium text-primary">{feature}</span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Nearby Places */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
                >
                  <h2 className="font-heading text-xl font-bold text-primary mb-6">Nearby Places</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {property.nearbyPlaces.map((place, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-accent" />
                          <span className="font-medium text-primary">{place.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{place.distance}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar - Agent Card */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="sticky top-24 bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
                >
                  <h3 className="font-heading text-lg font-bold text-primary mb-4">Contact Agent</h3>

                  {/* Agent Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={property.agent.image || "/placeholder.svg"}
                        alt={property.agent.name}
                        fill
                        className="object-cover"
                      />
                      {property.agent.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-primary">{property.agent.name}</h4>
                      <p className="text-sm text-muted-foreground">{property.agent.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{property.agent.listings} listings</span>
                        <span className="text-xs text-muted-foreground">{property.agent.experience} exp</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-light transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      Call Agent
                    </a>
                    <a
                      href={`https://wa.me/${property.agent.phone.replace(/\s/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </a>
                    <button
                      onClick={() => setShowContactForm(!showContactForm)}
                      className="flex items-center justify-center gap-2 w-full border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      Send Message
                    </button>
                  </div>

                  {/* Contact Form */}
                  {showContactForm && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6 space-y-4"
                    >
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="tel"
                        placeholder="Your Phone"
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <textarea
                        placeholder="I'm interested in this property..."
                        rows={4}
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      />
                      <button
                        type="submit"
                        className="w-full bg-accent text-primary py-3 rounded-xl font-semibold hover:bg-accent-hover transition-colors"
                      >
                        Send Inquiry
                      </button>
                    </motion.form>
                  )}

                  {/* Property Info */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Property ID</span>
                      <span className="font-medium text-primary">VTG-{property.id.toString().padStart(5, "0")}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Year Built</span>
                      <span className="font-medium text-primary">{property.yearBuilt}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium text-primary">2 days ago</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Properties */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Properties
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
