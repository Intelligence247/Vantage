"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import dayjs from "dayjs"
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Grid3X3,
  List,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { propertyService, Property } from "@/services/property.service"
import { toast } from "sonner"



export default function MyPropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadProperties = async () => {
      try {
          setIsLoading(true)
          const data = await propertyService.getAgentProperties(1, 100) // Load up to 100 for basic view
          setProperties(data.properties)
      } catch (error) {
          console.error("Failed to fetch properties:", error)
          toast.error("Could not lead properties.")
      } finally {
          setIsLoading(false)
      }
  }

  useEffect(() => {
      loadProperties()
  }, [])

  const filteredProperties = properties.filter((property) => {
    const locString = `${property.address} ${property.city} ${property.area} ${property.state}`.toLowerCase()
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locString.includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || property.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;
      try {
          await propertyService.deleteProperty(id)
          toast.success("Property deleted successfully")
          loadProperties()
      } catch (error) {
          console.error(error)
          toast.error("Failed to delete property")
      }
  }

  // Format price
  const formatPrice = (price: number, type: string, paymentPeriod?: string) => {
    const amount = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);
    if (type === 'rent' || type === 'shortlet') {
        return paymentPeriod ? `${amount}/${paymentPeriod}` : `${amount}/yr`;
    }
    return amount;
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">My Properties</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your property listings</p>
        </div>
        <Link href="/dashboard/vendor/properties/new">
          <Button className="bg-accent hover:bg-accent-hover text-primary font-semibold gap-2 shadow-lg shadow-accent/20">
            <Plus className="w-5 h-5" />
            Add Property
          </Button>
        </Link>
      </motion.div>

      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Live</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-primary" : ""}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-primary" : ""}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Properties Grid/List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-accent" />
        </div>
      ) : viewMode === "grid" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.images?.[0]?.url || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge
                      className={property.type === "sale" ? "bg-accent text-primary" : "bg-primary text-white"}
                    >
                      {property.type === 'sale' ? 'For Sale' : property.type === 'shortlet' ? 'Short Let' : 'For Rent'}
                    </Badge>
                    <Badge
                      className={
                        property.status === "available"
                          ? "bg-emerald-500 text-white"
                          : property.status === "pending"
                            ? "bg-amber-500 text-white"
                            : "bg-slate-500 text-white"
                      }
                    >
                      {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/properties/${property.id}`}>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Eye className="w-4 h-4" />
                            View
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/dashboard/vendor/properties/${property.id}/edit`}>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Pencil className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => handleDelete(property.id)} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-heading font-semibold text-foreground truncate">{property.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="truncate">{property.city ? `${property.city}, ${property.state}` : property.state}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property.beds || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.baths || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      {property.sqft || 0}m²
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="font-heading font-bold text-lg text-foreground">{formatPrice(property.price, property.type, property.paymentPeriod)}</span>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {property.views || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                    <Image
                      src={property.images?.[0]?.url || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2 sm:flex-col">
                      <Badge
                        className={property.type === "sale" ? "bg-accent text-primary" : "bg-primary text-white"}
                      >
                        {property.type === 'sale' ? 'For Sale' : property.type === 'shortlet' ? 'Short Let' : 'For Rent'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="flex-1 p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-semibold text-lg text-foreground truncate">
                            {property.title}
                          </h3>
                          <Badge
                            className={
                              property.status === "available"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : property.status === "pending"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-slate-500/10 text-slate-600"
                            }
                          >
                            {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span>{property.city ? `${property.city}, ${property.state}` : property.state}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            {property.beds || 0} beds
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            {property.baths || 0} baths
                          </span>
                          <span className="flex items-center gap-1">
                            <Maximize className="w-4 h-4" />
                            {property.sqft || 0}m²
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-heading font-bold text-xl text-foreground">{formatPrice(property.price, property.type, property.paymentPeriod)}</span>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground justify-end">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {property.views || 0} views
                          </span>
                          <span>{property.leads || 0} leads</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <span className="text-sm text-muted-foreground">Added {dayjs(property.createdAt).format('MMM D, YYYY')}</span>
                      <div className="flex gap-2">
                        <Link href={`/properties/${property.id}`}>
                            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                            <Eye className="w-4 h-4" />
                            View
                            </Button>
                        </Link>
                        <Link href={`/dashboard/vendor/properties/${property.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1 bg-transparent text-foreground">
                            <Pencil className="w-4 h-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleDelete(property.id)}
                          variant="outline"
                          size="sm"
                          className="gap-1 text-destructive hover:text-destructive bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No properties found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
