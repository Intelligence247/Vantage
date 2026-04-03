"use client"

import { useState, useEffect } from "react"
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
  Loader2
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
import { inquiryService, Inquiry } from "@/services/inquiry.service"
import { toast } from "sonner"
import dayjs from "dayjs"

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
    case "responded":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Responded
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    case "closed":
      return (
        <Badge className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Closed
        </Badge>
      )
    default:
      return null
  }
}

export default function MyVisitsPage() {
  const [scheduledVisits, setScheduledVisits] = useState<Inquiry[]>([])
  const [pastVisits, setPastVisits] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchVisits = async () => {
    try {
      setIsLoading(true)
      const data = await inquiryService.getInbox(1, 100)
      const inquiries = data.inquiries || []
      setScheduledVisits(inquiries.filter((inc) => inc.status !== 'closed'))
      setPastVisits(inquiries.filter((inc) => inc.status === 'closed'))
    } catch (error) {
      console.error("Failed to fetch visits:", error)
      toast.error("Failed to load your visits")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVisits()
  }, [])
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
          {isLoading ? (
             <div className="flex justify-center p-8">
               <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
             </div>
          ) : scheduledVisits.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground bg-card rounded-xl border">
                  No upcoming visits scheduled.
              </div>
          ) : scheduledVisits.map((visit) => {
             const property = typeof visit.property === 'object' ? visit.property : null;
             
             return (
            <motion.div key={visit._id} variants={itemVariants}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0 bg-muted">
                    <Image
                      src={property?.images?.[0]?.url || "/placeholder.svg"}
                      alt={property?.title || "Property"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-semibold text-lg text-foreground truncate">
                            {property?.title || `Property ID: ${visit.property}`}
                          </h3>
                          {getStatusBadge(visit.status)}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{property?.location?.address || 'Location Unavailable'}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1 text-foreground font-medium">
                            <Calendar className="w-4 h-4 text-accent" />
                            {dayjs(visit.createdAt).format('MMM D, YYYY')}
                          </span>
                          <span className="flex items-center gap-1 text-foreground font-medium">
                            <Clock className="w-4 h-4 text-accent" />
                            {dayjs(visit.createdAt).format('h:mm A')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {visit.name || 'Agent Name'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {visit.phone || property?.agent?.phone || 'N/A'}
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
          )})}
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
            {pastVisits.map((visit) => {
              const property = typeof visit.property === 'object' ? visit.property : null;
                
              return (
              <motion.div key={visit._id} variants={itemVariants}>
                <Card className="overflow-hidden opacity-75 hover:opacity-100 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-32 sm:h-auto flex-shrink-0 bg-muted grayscale">
                      <Image
                        src={property?.images?.[0]?.url || "/placeholder.svg"}
                        alt={property?.title || "Property"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-heading font-semibold text-foreground truncate">
                              {property?.title || `Property ID: ${visit.property}`}
                            </h3>
                            {getStatusBadge(visit.status)}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{property?.location?.address || 'Location Unavailable'}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {dayjs(visit.createdAt).format('MMM D, YYYY')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {dayjs(visit.createdAt).format('h:mm A')}
                            </span>
                          </div>
                        </div>
                        <Link href={`/properties/${typeof visit.property === 'object' ? visit.property._id : visit.property}`}>
                          <Button variant="outline" size="sm">
                            View Property
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            )})}
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
