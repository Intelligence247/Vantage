"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Home,
  Building2,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Maximize,
  Car,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const propertyTypes = [
  { value: "house", label: "House", icon: Home },
  { value: "apartment", label: "Apartment", icon: Building2 },
  { value: "duplex", label: "Duplex", icon: Building2 },
  { value: "villa", label: "Villa", icon: Home },
  { value: "land", label: "Land", icon: MapPin },
]

const amenities = [
  "Swimming Pool",
  "Gym/Fitness Center",
  "24/7 Security",
  "Generator",
  "Parking Space",
  "Garden",
  "Smart Home Features",
  "Air Conditioning",
  "Servant Quarters",
  "CCTV Surveillance",
  "Water Treatment",
  "Solar Power",
]

export default function NewPropertyPage() {
  const [selectedType, setSelectedType] = useState("")
  const [listingType, setListingType] = useState("")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link
          href="/dashboard/properties"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Link>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">Add New Property</h1>
        <p className="text-muted-foreground mt-1">Fill in the details below to list your property</p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Property Title</Label>
                <Input id="title" placeholder="e.g., Luxury 4-Bedroom Duplex with Pool" className="mt-1.5" />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property in detail..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Property Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Listing Type</Label>
                  <Select value={listingType} onValueChange={setListingType}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select listing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                      <SelectItem value="shortlet">Short Let</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" placeholder="e.g., 15 Admiralty Way" className="mt-1.5" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="e.g., Lagos" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="area">Area/District</Label>
                  <Input id="area" placeholder="e.g., Lekki Phase 1" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="abuja">Abuja (FCT)</SelectItem>
                      <SelectItem value="rivers">Rivers</SelectItem>
                      <SelectItem value="oyo">Oyo</SelectItem>
                      <SelectItem value="kano">Kano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input id="price" type="number" placeholder="e.g., 85000000" className="mt-1.5" />
                </div>
                {listingType === "rent" && (
                  <div>
                    <Label>Payment Period</Label>
                    <Select>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yearly">Per Year</SelectItem>
                        <SelectItem value="monthly">Per Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="beds" className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-muted-foreground" />
                    Bedrooms
                  </Label>
                  <Input id="beds" type="number" min="0" placeholder="0" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="baths" className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-muted-foreground" />
                    Bathrooms
                  </Label>
                  <Input id="baths" type="number" min="0" placeholder="0" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="sqft" className="flex items-center gap-2">
                    <Maximize className="w-4 h-4 text-muted-foreground" />
                    Size (m²)
                  </Label>
                  <Input id="sqft" type="number" min="0" placeholder="0" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="parking" className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    Parking
                  </Label>
                  <Input id="parking" type="number" min="0" placeholder="0" className="mt-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Amenities & Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => toggleAmenity(amenity)}
                  >
                    <Checkbox
                      id={amenity}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <Label htmlFor={amenity} className="text-sm font-normal cursor-pointer">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-accent" />
                Property Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-1">Drag and drop your images here, or click to browse</p>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB (max 10 images)</p>
                <Button variant="outline" className="mt-4 gap-2 bg-transparent">
                  <Plus className="w-4 h-4" />
                  Add Images
                </Button>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/dashboard/properties">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-accent hover:bg-accent-hover text-primary font-semibold gap-2 min-w-[140px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Publish Property
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </form>
    </div>
  )
}
