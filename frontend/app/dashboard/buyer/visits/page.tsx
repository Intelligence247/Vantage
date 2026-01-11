"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock scheduled visits data
const scheduledVisits = [
  {
    id: 1,
    propertyTitle: "Luxury 4-Bedroom Duplex",
    propertyImage: "/modern-luxury-duplex-house-exterior-lagos.jpg",
    location: "Lekki Phase 1, Lagos",
    date: "Dec 15, 2025",
    time: "10:00 AM",
    status: "confirmed",
    agent: {
      name: "Chidi Okonkwo",
      phone: "+234 801 234 5678",
    },
  },
  {
    id: 2,
    propertyTitle: "Modern 3-Bedroom Apartment",
    propertyImage: "/contemporary-penthouse-apartment-lagos.jpg",
    location: "Victoria Island, Lagos",
    date: "Dec 18, 2025",
    time: "2:00 PM",
    status: "pending",
    agent: {
      name: "Amaka Eze",
      phone: "+234 802 345 6789",
    },
  },
  {
    id: 3,
    propertyTitle: "Executive 5-Bedroom Mansion",
    propertyImage: "/waterfront-mansion-banana-island-lagos.jpg",
    location: "Banana Island, Lagos",
    date: "Dec 20, 2025",
    time: "11:00 AM",
    status: "confirmed",
    agent: {
      name: "Tunde Bakare",
      phone: "+234 803 456 7890",
    },
  },
]

const pastVisits = [
  {
    id: 4,
    propertyTitle: "Smart Home Apartment",
    propertyImage: "/smart-home-apartment-eko-atlantic-lagos.jpg",
    location: "Eko Atlantic, Lagos",
    date: "Dec 5, 2025",
    time: "3:00 PM",
    status: "completed",
    agent: {
      name: "Kemi Adeyemi",
      phone: "+234 804 567 8901",
    },
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function getStatusBadge(status: string) {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Confirmed
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>
      )
    default:
      return null
  }
}

export default function MyVisitsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
            My Visits
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your property inspection schedule
          </p>
        </div>
        <Link href="/properties">
          <Button className="bg-accent hover:bg-accent-hover text-primary font-semibold gap-2 shadow-lg shadow-accent/20">
            <Calendar className="w-5 h-5" />
            Schedule New Visit
          </Button>
        </Link>
      </motion.div>

      {/* Upcoming Visits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
          Upcoming Visits ({scheduledVisits.length})
        </h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {scheduledVisits.map((visit) => (
            <motion.div key={visit.id} variants={itemVariants}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0">
                    <Image
                      src={visit.propertyImage || "/placeholder.svg"}
                      alt={visit.propertyTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-semibold text-lg text-foreground truncate">
                            {visit.propertyTitle}
                          </h3>
                          {getStatusBadge(visit.status)}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{visit.location}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1 text-foreground font-medium">
                            <Calendar className="w-4 h-4 text-accent" />
                            {visit.date}
                          </span>
                          <span className="flex items-center gap-1 text-foreground font-medium">
                            <Clock className="w-4 h-4 text-accent" />
                            {visit.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {visit.agent.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {visit.agent.phone}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <MessageSquare className="w-4 h-4" />
                            Message Agent
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Calendar className="w-4 h-4" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                            <XCircle className="w-4 h-4" />
                            Cancel Visit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Past Visits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
          Past Visits ({pastVisits.length})
        </h2>
        {pastVisits.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {pastVisits.map((visit) => (
              <motion.div key={visit.id} variants={itemVariants}>
                <Card className="overflow-hidden opacity-75 hover:opacity-100 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-32 sm:h-auto flex-shrink-0 grayscale">
                      <Image
                        src={visit.propertyImage || "/placeholder.svg"}
                        alt={visit.propertyTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-heading font-semibold text-foreground truncate">
                              {visit.propertyTitle}
                            </h3>
                            {getStatusBadge(visit.status)}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{visit.location}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {visit.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {visit.time}
                            </span>
                          </div>
                        </div>
                        <Link href={`/properties/${visit.id}`}>
                          <Button variant="outline" size="sm">
                            View Property
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No past visits yet.
          </div>
        )}
      </motion.div>
    </div>
  )
}
