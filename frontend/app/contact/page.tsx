"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Plot 24, Adeola Odeku Street", "Victoria Island, Lagos, Nigeria"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+234 800 123 4567", "+234 802 345 6789"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["hello@vantage.ng", "support@vantage.ng"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Mon - Fri: 8:00 AM - 6:00 PM", "Sat: 9:00 AM - 4:00 PM"],
  },
]

const officeLocations = [
  {
    city: "Lagos (HQ)",
    address: "Plot 24, Adeola Odeku Street, Victoria Island",
    phone: "+234 800 123 4567",
    image: "/modern-office-building-lagos-nigeria.jpg",
  },
  {
    city: "Abuja",
    address: "Plot 123, Maitama District, Abuja",
    phone: "+234 800 234 5678",
    image: "/modern-office-building-abuja-nigeria.jpg",
  },
  {
    city: "Port Harcourt",
    address: "45 Aba Road, Old GRA, Port Harcourt",
    phone: "+234 800 345 6789",
    image: "/modern-office-building-port-harcourt-nigeria.jpg",
  },
]

const faqs = [
  {
    question: "How do I list my property on VANTAGE?",
    answer:
      "Simply create an account, click on 'Post a Property', fill in the details, upload photos, and submit. Our team will verify your listing within 24-48 hours.",
  },
  {
    question: "Are all agents on VANTAGE verified?",
    answer:
      "Yes, we have a rigorous verification process for all agents. We verify their credentials, license, and track record before they can list properties on our platform.",
  },
  {
    question: "How much does it cost to list a property?",
    answer:
      "Basic listings are free. Premium listings with enhanced visibility and additional features start from ₦25,000 per month.",
  },
  {
    question: "How can I schedule a property viewing?",
    answer:
      "You can schedule viewings directly through the property page by clicking 'Schedule Viewing' or contacting the agent via phone, WhatsApp, or email.",
  },
]

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative bg-primary py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold mb-6">
                Get In Touch
              </span>
              <h1 className="font-heading text-4xl lg:text-6xl font-bold text-white leading-tight">
                We&apos;d Love to Hear From You
              </h1>
              <p className="mt-6 text-xl text-white/70 leading-relaxed">
                Have questions about our platform? Want to list your property? Our team is here to help.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 -mt-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-shadow"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-muted-foreground text-sm">
                      {detail}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="font-heading text-3xl font-bold text-primary mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                    <p className="text-green-700">Thank you for reaching out. Our team will get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-primary">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-primary">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-primary">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+234 800 000 0000"
                          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="block text-sm font-medium text-primary">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="listing">Property Listing</option>
                          <option value="agent">Become an Agent</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-medium text-primary">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary-light transition-colors disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>

              {/* Map & Quick Contact */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Map Placeholder */}
                <div className="relative h-[300px] rounded-2xl overflow-hidden bg-muted">
                  <Image src="/victoria-island-lagos-map-location.jpg" alt="Office Location Map" fill className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-4 shadow-lg flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary">VANTAGE HQ</p>
                        <p className="text-sm text-muted-foreground">Victoria Island, Lagos</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Options */}
                <div className="bg-muted/30 rounded-xl p-6">
                  <h3 className="font-heading font-bold text-lg text-primary mb-4">Quick Contact</h3>
                  <div className="space-y-4">
                    <a
                      href="tel:+2348001234567"
                      className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary">Call Us Now</p>
                        <p className="text-sm text-muted-foreground">+234 800 123 4567</p>
                      </div>
                    </a>
                    <a
                      href="https://wa.me/2348023456789"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary">WhatsApp Us</p>
                        <p className="text-sm text-muted-foreground">Quick response guaranteed</p>
                      </div>
                    </a>
                  </div>

                  {/* Social Links */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm font-medium text-primary mb-4">Follow Us</p>
                    <div className="flex items-center gap-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.href}
                          aria-label={social.label}
                          className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white text-primary transition-colors"
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <span className="text-accent font-semibold">Our Offices</span>
              <h2 className="mt-2 font-heading text-3xl lg:text-4xl font-bold text-primary">Visit Us Nationwide</h2>
              <p className="mt-4 text-muted-foreground">
                We have offices in major cities across Nigeria to serve you better.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {officeLocations.map((office, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
                >
                  <div className="relative h-40">
                    <Image src={office.image || "/placeholder.svg"} alt={office.city} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-lg text-primary mb-2">{office.city}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{office.address}</p>
                    <a href={`tel:${office.phone}`} className="text-accent font-medium text-sm hover:text-accent-hover">
                      {office.phone}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-accent font-semibold">FAQ</span>
              <h2 className="mt-2 font-heading text-3xl lg:text-4xl font-bold text-primary">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
                >
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
