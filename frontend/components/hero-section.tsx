"use client"

import { motion } from "framer-motion"
import { Search, MapPin, Home, DollarSign } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Nigeria's #1 Verified Property Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-tight text-balance max-w-4xl mx-auto"
          >
            Find Your Place in <span className="text-accent">Nigeria's Future</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            The most trusted platform for verified property listings, supported by modern technology and
            government-grade security.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Location */}
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>

                {/* Property Type */}
                <div className="relative">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <select className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer">
                    <option value="">Property Type</option>
                    <option value="duplex">Duplex</option>
                    <option value="flat">Flat</option>
                    <option value="bungalow">Bungalow</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <select className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer">
                    <option value="">Price Range</option>
                    <option value="0-1m">Under ₦1M</option>
                    <option value="1m-5m">₦1M - ₦5M</option>
                    <option value="5m-20m">₦5M - ₦20M</option>
                    <option value="20m-50m">₦20M - ₦50M</option>
                    <option value="50m+">₦50M+</option>
                  </select>
                </div>

                {/* Search Button */}
                <button className="bg-accent hover:bg-accent-hover text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-accent/30">
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {[
              { value: "15K+", label: "Properties" },
              { value: "2.5K+", label: "Verified Agents" },
              { value: "50K+", label: "Happy Clients" },
              { value: "36", label: "States Covered" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-heading text-3xl lg:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>
    </section>
  )
}
