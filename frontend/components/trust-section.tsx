"use client"

import { motion } from "framer-motion"

const partners = [
  { name: "Ministry of Housing", logo: "MOH" },
  { name: "Federal Mortgage Bank", logo: "FMB" },
  { name: "REDAN", logo: "REDAN" },
  { name: "Lagos State", logo: "LASG" },
  { name: "NIPOST", logo: "NIPOST" },
]

export function TrustSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Our Commitment</span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-4 tracking-tight mb-6">
            Setting the Standard for Nigerian Real Estate
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            We are redefining the property market with transparency, technology, and trust.
          </p>

          {/* Partner Logos */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <span className="font-heading text-xl font-bold text-secondary">{partner.logo}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20 bg-gradient-to-r from-primary to-primary-light rounded-3xl p-8 lg:p-12 text-center"
        >
          <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight text-balance">
            Ready to Find Your Dream Property?
          </h3>
          <p className="text-white/80 mt-4 text-lg max-w-xl mx-auto">
            Join thousands of Nigerians who have found their perfect home through VANTAGE.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-accent/30">
              Start Your Search
            </button>
            <button className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-200 active:scale-[0.98]">
              List Your Property
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
