"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Search, Star, Loader2, ArrowRight, Bed, Bath, Maximize, Heart, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { userService, UserProfile } from "@/services/user.service"
import { propertyService, Property } from "@/services/property.service"
import { inquiryService } from "@/services/inquiry.service"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function AgentProfilePage() {
  const { id } = useParams()
  const agentId = Array.isArray(id) ? id[0] : id

  const [agent, setAgent] = useState<UserProfile | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [messageForm, setMessageForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  useEffect(() => {
    let mounted = true
    if (!agentId) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const agentData = await userService.getUserById(agentId)
        
        let propsResponse: any = { properties: [] }
        try {
            propsResponse = await propertyService.getAll({ agent: agentId, limit: 100 })
        } catch(e) {
            console.error("Agent properties error (might be empty):", e)
        }

        if (mounted) {
          setAgent(agentData)
          setProperties(propsResponse.properties || [])
        }
      } catch (error) {
        console.error("Failed to load agent profile", error)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [agentId])

  const handleContactAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSendingMessage(true)
      await inquiryService.createInquiry({
        ...messageForm,
        agent: agentId,
        type: "contact",
      })
      toast.success("Message sent successfully!")
      setMessageForm({ name: "", email: "", phone: "", message: "" })
    } catch (error) {
        console.error(error)
      toast.error("Failed to send message")
    } finally {
      setIsSendingMessage(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-3xl font-heading font-bold mb-4">Agent Not Found</h1>
        <Link href="/agents">
          <Button variant="outline">Return to Directory</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile Header Background */}
      <div className="h-64 md:h-80 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-6 max-w-6xl -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar: Agent Info Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-t-4 border-t-accent">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-primary/10 border-4 border-background shadow-lg mb-6 flex items-center justify-center relative">
                  {agent.avatar ? (
                    <Image src={agent.avatar} alt={agent.name} fill className="object-cover" />
                  ) : (
                    <span className="font-heading font-bold text-5xl text-primary capitalize">{agent.name[0]}</span>
                  )}
                </div>
                <h1 className="text-2xl font-heading font-bold text-foreground capitalize">{agent.name}</h1>
                <p className="text-muted-foreground mt-1 mb-4 flex items-center gap-1 justify-center">
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-0">Verified Realtor</Badge>
                </p>

                <div className="w-full space-y-4 my-6">
                  {agent.phone && (
                    <div className="flex items-center gap-3 text-muted-foreground p-3 rounded-xl bg-muted/50">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{agent.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-muted-foreground p-3 rounded-xl bg-muted/50 overflow-hidden">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{agent.email}</span>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-primary hover:bg-primary-light text-white shadow-md gap-2" size="lg">
                      <MessageSquare className="w-5 h-5" />
                      Contact Agent
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Contact {agent.name}</DialogTitle>
                      <DialogDescription>
                        Send a message directly. They typically reply within a few hours.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleContactAgent} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Input
                          placeholder="Your Name"
                          value={messageForm.name}
                          onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="email"
                          placeholder="Email"
                          value={messageForm.email}
                          onChange={(e) => setMessageForm({ ...messageForm, email: e.target.value })}
                          required
                        />
                        <Input
                          placeholder="Phone (optional)"
                          value={messageForm.phone}
                          onChange={(e) => setMessageForm({ ...messageForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Textarea
                          placeholder="What would you like to discuss?"
                          value={messageForm.message}
                          onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                          required
                          rows={4}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSendingMessage}>
                        {isSendingMessage ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Send Message
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Right Content: Agent's Properties */}
          <div className="lg:col-span-2 pt-8 lg:pt-0">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-heading font-bold">Active Listings</h2>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {properties.length} Properties
              </Badge>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
                <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold text-foreground">No active properties</h3>
                <p className="text-muted-foreground mt-2">This agent currently has no public listings.</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {properties.map((property) => (
                  <motion.div key={property.id} variants={itemVariants}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col border-border/50">
                      <div className="relative h-48 overflow-hidden flex-shrink-0">
                        {property.images?.[0]?.url ? (
                            <Image
                            src={property.images[0].url}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">No Image</div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className={property.type === "sale" ? "bg-accent text-primary" : "bg-primary text-white"}>
                            {property.type === "sale" ? "For Sale" : property.type === "rent" ? "For Rent" : "Shortlet"}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <h3 className="font-heading font-semibold text-foreground line-clamp-1 mb-1" title={property.title}>
                            {property.title}
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{property.address || ''}, {property.city || ''}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1" title="Bedrooms">
                            <Bed className="w-4 h-4" /> {property.beds || 0}
                          </span>
                          <span className="flex items-center gap-1" title="Bathrooms">
                            <Bath className="w-4 h-4" /> {property.baths || 0}
                          </span>
                          <span className="flex items-center gap-1" title="Square Meters">
                            <Maximize className="w-4 h-4" /> {property.sqft || 0}m²
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                          <span className="font-heading font-bold text-lg text-foreground">
                            {formatPrice(property.price)}
                          </span>
                          <Link href={`/properties/${property.id}`}>
                            <Button variant="outline" size="sm" className="group-hover:border-accent">
                                Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
