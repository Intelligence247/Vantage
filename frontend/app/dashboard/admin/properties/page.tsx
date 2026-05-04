"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Eye,
  MapPin,
  Building2,
  AlertTriangle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { propertyService, Property } from "@/services/property.service"
import { adminService } from "@/services/admin.service"
import { toast } from "sonner"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"

dayjs.extend(relativeTime)

export default function AdminPropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      // Fetch all properties so we can filter clientside (or we could fetch based on tab)
      // We will parse max 100 for global dashboard review, or use pagination fully in a deeper build.
      const res = await propertyService.getAll({ page: 1, limit: 100 })
      setProperties(res.properties)
    } catch (error) {
      console.error("Failed to load properties:", error)
      toast.error("Error loading property listings")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    try {
      if (status === 'available') {
          await adminService.approveProperty(id);
          toast.success("Property approved successfully");
      } else {
          await propertyService.updateProperty(id, { status });
          toast.success(`Property successfully marked as ${status}`);
      }
      fetchProperties()
    } catch (error) {
       console.error(error)
       toast.error("Failed to update property status")
    }
  }

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (property.city || property.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof property.agent === 'object' ? property.agent?.name : '').toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "pending") return matchesSearch && property.status === "pending"
    if (activeTab === "live") return matchesSearch && property.status === "available"
    if (activeTab === "sold") return matchesSearch && property.status === "sold"

    return matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
            Live
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-0 shadow-none">
            Pending Review
          </Badge>
        )
      case "sold":
        return <Badge variant="secondary" className="shadow-none">Sold</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
            Property Moderation
          </h1>
          <p className="text-muted-foreground mt-1">
            Review, approve, or reject property listings.
          </p>
        </div>
      </div>

      {/* Controls & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 md:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending" className="relative">
                  Pending
                  {properties.filter((p) => p.status === "pending").length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-background" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="live">Live</TabsTrigger>
                <TabsTrigger value="sold">Sold</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      <div className="space-y-4">
        {isLoading ? (
             <div className="flex justify-center py-12">
                 <Loader2 className="w-10 h-10 animate-spin text-primary" />
             </div>
        ) : filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={property.id}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-muted">
                    <Image
                      src={property.images?.[0]?.url || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm shadow-sm capitalize">
                        {property.propertyKind || property.type || property.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-heading font-semibold text-lg text-foreground truncate">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{property.location?.type === 'Point' ? 'Geolocation set' : (property.city || property.address)}</span>
                          </div>
                        </div>
                        {getStatusBadge(property.status)}
                      </div>
                      
                      <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span>Listed by <span className="text-foreground font-medium">{typeof property.agent === 'object' ? property.agent?.name : 'Unknown User'}</span></span>
                        </div>
                        <div>
                            <span>Posted {dayjs(property.createdAt).fromNow()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                      <span className="font-heading font-bold text-xl text-foreground">
                        {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(property.price)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Link href={`/properties/${property.id}`} className="inline-flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        {property.status === "pending" ? (
                            <>
                                <Button onClick={() => handleStatusChange(property.id, 'available')} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                </Button>
                            </>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleStatusChange(property.id, 'pending')}>Revert to Pending</DropdownMenuItem>
                                    {property.status !== "sold" && (
                                      <DropdownMenuItem onClick={() => handleStatusChange(property.id, 'sold')} className="text-destructive">
                                        Mark as Sold
                                      </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
            <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h3 className="font-medium text-foreground">No properties found</h3>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
            </div>
        )}
      </div>
    </div>
  )
}
