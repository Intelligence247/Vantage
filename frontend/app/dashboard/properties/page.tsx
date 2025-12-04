"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const properties = [
  {
    id: 1,
    title: "Luxury 4-Bedroom Duplex",
    location: "Lekki Phase 1, Lagos",
    price: "₦85,000,000",
    type: "For Sale",
    status: "active",
    views: 342,
    leads: 8,
    beds: 4,
    baths: 5,
    sqft: "450",
    image: "/modern-luxury-duplex-house-exterior-lagos.jpg",
    createdAt: "Dec 1, 2025",
  },
  {
    id: 2,
    title: "Modern 3-Bedroom Apartment",
    location: "Victoria Island, Lagos",
    price: "₦2,500,000/yr",
    type: "For Rent",
    status: "active",
    views: 218,
    leads: 5,
    beds: 3,
    baths: 3,
    sqft: "280",
    image: "/contemporary-penthouse-apartment-lagos.jpg",
    createdAt: "Nov 28, 2025",
  },
  {
    id: 3,
    title: "Executive 5-Bedroom Mansion",
    location: "Banana Island, Lagos",
    price: "₦450,000,000",
    type: "For Sale",
    status: "sold",
    views: 567,
    leads: 12,
    beds: 5,
    baths: 7,
    sqft: "850",
    image: "/waterfront-mansion-banana-island-lagos.jpg",
    createdAt: "Nov 15, 2025",
  },
  {
    id: 4,
    title: "Smart Home Apartment",
    location: "Eko Atlantic, Lagos",
    price: "₦120,000,000",
    type: "For Sale",
    status: "active",
    views: 189,
    leads: 4,
    beds: 3,
    baths: 4,
    sqft: "320",
    image: "/smart-home-apartment-eko-atlantic-lagos.jpg",
    createdAt: "Nov 10, 2025",
  },
  {
    id: 5,
    title: "Garden Terrace House",
    location: "Maitama, Abuja",
    price: "₦95,000,000",
    type: "For Sale",
    status: "pending",
    views: 256,
    leads: 6,
    beds: 4,
    baths: 4,
    sqft: "400",
    image: "/garden-terrace-house-maitama-abuja.jpg",
    createdAt: "Nov 5, 2025",
  },
]

export default function MyPropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || property.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
        <Link href="/dashboard/properties/new">
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
              <SelectItem value="active">Active</SelectItem>
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
      {viewMode === "grid" ? (
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
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge
                      className={property.type === "For Sale" ? "bg-accent text-primary" : "bg-primary text-white"}
                    >
                      {property.type}
                    </Badge>
                    <Badge
                      className={
                        property.status === "active"
                          ? "bg-emerald-500 text-white"
                          : property.status === "pending"
                            ? "bg-amber-500 text-white"
                            : "bg-slate-500 text-white"
                      }
                    >
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
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
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Eye className="w-4 h-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Pencil className="w-4 h-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
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
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{property.location}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      {property.sqft}m²
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="font-heading font-bold text-lg text-foreground">{property.price}</span>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {property.views}
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
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2 sm:flex-col">
                      <Badge
                        className={property.type === "For Sale" ? "bg-accent text-primary" : "bg-primary text-white"}
                      >
                        {property.type}
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
                              property.status === "active"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : property.status === "pending"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-slate-500/10 text-slate-600"
                            }
                          >
                            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{property.location}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            {property.beds} beds
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            {property.baths} baths
                          </span>
                          <span className="flex items-center gap-1">
                            <Maximize className="w-4 h-4" />
                            {property.sqft}m²
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-heading font-bold text-xl text-foreground">{property.price}</span>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground justify-end">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {property.views} views
                          </span>
                          <span>{property.leads} leads</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <span className="text-sm text-muted-foreground">Added {property.createdAt}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
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
