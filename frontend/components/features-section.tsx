"use client"

import { motion } from "framer-motion"
import { ShieldCheck, View, BarChart3 } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Agents",
    description:
      "Every agent on our platform goes through a rigorous verification process. Your safety is our priority.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: View,
    title: "360° Virtual Tours",
    description:
      "Experience properties from anywhere with our immersive virtual tours. Walk through every room before you visit.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: BarChart3,
    title: "Smart Insights",
    description: "Make informed decisions with our AI-powered market analysis and neighborhood insights.",
    color: "bg-amber-50 text-amber-600",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-4 tracking-tight text-balance">
            Built for Trust, Designed for Excellence
          </h2>
          <p className="text-secondary mt-4 text-lg leading-relaxed">
            We combine cutting-edge technology with rigorous verification to deliver a property experience like no
            other.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-white rounded-2xl p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-2px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">{feature.title}</h3>
              <p className="text-secondary leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
