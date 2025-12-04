"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, Users, Award, TrendingUp, Check, ArrowRight, Target, Eye } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const stats = [
  { value: "15,000+", label: "Properties Listed" },
  { value: "2,500+", label: "Verified Agents" },
  { value: "50,000+", label: "Happy Customers" },
  { value: "₦2T+", label: "Property Value Traded" },
]

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "Every listing and agent on our platform goes through rigorous verification to ensure authenticity.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "We put our customers at the heart of everything we do, providing exceptional support throughout their journey.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in every aspect, from our technology to our customer service.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "We leverage cutting-edge technology like 360° virtual tours to transform the real estate experience.",
  },
]

const team = [
  {
    name: "Olumide Adeyemo",
    role: "Founder & CEO",
    image: "/professional-nigerian-male-ceo-portrait-business-a.jpg",
    bio: "Former Goldman Sachs executive with 15 years in real estate investment.",
  },
  {
    name: "Amara Okafor",
    role: "Chief Technology Officer",
    image: "/professional-nigerian-female-cto-portrait-tech-exe.jpg",
    bio: "Ex-Google engineer, pioneering proptech innovation in Africa.",
  },
  {
    name: "Chukwuemeka Nwosu",
    role: "Head of Operations",
    image: "/professional-nigerian-male-operations-director-por.jpg",
    bio: "Scaled operations at Jumia, now transforming Nigerian real estate.",
  },
  {
    name: "Funke Adekunle",
    role: "Chief Marketing Officer",
    image: "/professional-nigerian-female-cmo-portrait-marketin.jpg",
    bio: "Award-winning marketer with expertise in African consumer markets.",
  },
]

const timeline = [
  { year: "2019", event: "VANTAGE founded in Lagos with a vision to transform Nigerian real estate" },
  { year: "2020", event: "Launched 360° virtual tour technology, a first in Nigeria" },
  { year: "2021", event: "Expanded to Abuja and Port Harcourt, reached 5,000 listings" },
  { year: "2022", event: "Introduced verified agent program and AI-powered property recommendations" },
  { year: "2023", event: "Crossed ₦1 trillion in property transactions facilitated" },
  { year: "2024", event: "Launched VANTAGE 2.0 with enhanced features and nationwide coverage" },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative bg-primary py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold mb-6">
                About VANTAGE
              </span>
              <h1 className="font-heading text-4xl lg:text-6xl font-bold text-white leading-tight">
                Building the Future of Nigerian Real Estate
              </h1>
              <p className="mt-6 text-xl text-white/70 leading-relaxed">
                We&apos;re on a mission to make property transactions in Nigeria transparent, efficient, and accessible
                to everyone.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <p className="font-heading text-4xl lg:text-5xl font-bold text-accent">{stat.value}</p>
                  <p className="mt-2 text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="text-accent font-semibold">Our Story</span>
                <h2 className="mt-2 font-heading text-3xl lg:text-4xl font-bold text-primary">
                  From a Vision to Nigeria&apos;s Leading Property Platform
                </h2>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  VANTAGE was born out of frustration with the Nigerian real estate market. Our founder, Olumide
                  Adeyemo, experienced firsthand the challenges of finding verified properties and trustworthy agents
                  while searching for his family home.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  What started as a simple idea to bring transparency to property transactions has grown into
                  Nigeria&apos;s most trusted real estate marketplace. Today, we connect thousands of Nigerians with
                  their dream properties every month.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    "First to introduce 360° virtual tours in Nigeria",
                    "Rigorous agent verification process",
                    "AI-powered property matching technology",
                  ].map((point, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-primary font-medium">{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                  <Image src="/modern-office-space-lagos-nigeria-tech-startup.jpg" alt="VANTAGE Office" fill className="object-cover" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-accent p-6 rounded-xl shadow-xl">
                  <p className="font-heading text-3xl font-bold text-primary">5+</p>
                  <p className="text-primary/80">Years of Excellence</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20 lg:py-28 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="text-accent font-semibold">What Drives Us</span>
              <h2 className="mt-2 font-heading text-3xl lg:text-4xl font-bold text-primary">
                Our Mission, Vision & Values
              </h2>
            </motion.div>

            {/* Mission & Vision Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-primary rounded-2xl p-8"
              >
                <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-4">Our Mission</h3>
                <p className="text-white/80 leading-relaxed">
                  To democratize access to quality real estate in Nigeria by providing a transparent, technology-driven
                  platform that connects buyers, sellers, and renters with verified properties and trusted
                  professionals.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become Africa&apos;s most trusted real estate marketplace, setting the standard for property
                  transactions across the continent while empowering millions to find their perfect home.
                </p>
              </motion.div>
            </div>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-shadow"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="text-accent font-semibold">Our Journey</span>
              <h2 className="mt-2 font-heading text-3xl lg:text-4xl font-bold text-primary">
                Milestones Along the Way
              </h2>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-border lg:-translate-x-1/2" />

              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center gap-8 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"} hidden lg:block`}>
                      <div
                        className={`inline-block bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] ${index % 2 === 0 ? "lg:mr-8" : "lg:ml-8"}`}
                      >
                        <p className="font-heading text-2xl font-bold text-accent">{item.year}</p>
                        <p className="mt-2 text-muted-foreground">{item.event}</p>
                      </div>
                    </div>
                    <div className="absolute left-8 lg:left-1/2 w-4 h-4 bg-accent rounded-full lg:-translate-x-1/2 ring-4 ring-background" />
                    <div className="flex-1 pl-16 lg:pl-0 lg:hidden">
                      <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                        <p className="font-heading text-2xl font-bold text-accent">{item.year}</p>
                        <p className="mt-2 text-muted-foreground">{item.event}</p>
                      </div>
                    </div>
                    <div className="flex-1 hidden lg:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 lg:py-28 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="text-accent font-semibold">Our Leadership</span>
              <h2 className="mt-2 font-heading text-3xl lg:text-4xl font-bold text-primary">Meet the Team</h2>
              <p className="mt-4 text-muted-foreground">
                Our diverse team brings together expertise from technology, finance, and real estate.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-primary">{member.name}</h3>
                  <p className="text-accent font-medium text-sm">{member.role}</p>
                  <p className="mt-2 text-muted-foreground text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white">
                Ready to Find Your Perfect Property?
              </h2>
              <p className="mt-4 text-white/70 text-lg">
                Join thousands of Nigerians who trust VANTAGE for their real estate needs.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-xl font-semibold hover:bg-accent-hover transition-colors"
                >
                  Browse Properties
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
