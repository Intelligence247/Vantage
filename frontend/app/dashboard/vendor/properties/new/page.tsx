"use client"

import type React from "react"

import dynamic from "next/dynamic"
import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { propertyService } from "@/services/property.service"
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Home,
  Building2,
  MapPin,
  Crosshair,
  DollarSign,
  Bed,
  Bath,
  Maximize,
  Car,
  ImageIcon,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const PropertyLocationPreview = dynamic(
  () =>
    import("@/components/property-location-preview").then((m) => m.PropertyLocationPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-56 w-full max-w-2xl items-center justify-center rounded-xl border border-dashed border-border bg-muted/50 text-sm text-muted-foreground">
        Loading map…
      </div>
    ),
  },
)

const propertyTypes = [
  { value: "sale", label: "Sale", icon: Home },
  { value: "rent", label: "Rent", icon: Building2 },
  { value: "shortlet", label: "Shortlet", icon: Home },
]

const propertyKinds = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "duplex", label: "Duplex" },
  { value: "villa", label: "Villa" },
  { value: "land", label: "Land" },
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
  const router = useRouter()
  // Basic Info
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("sale")
  const [propertyKind, setPropertyKind] = useState("house")
  // Location
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [area, setArea] = useState("")
  const [state, setState] = useState("lagos")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  // Pricing
  const [price, setPrice] = useState("")
  const [paymentPeriod, setPaymentPeriod] = useState("yearly")
  // Details
  const [beds, setBeds] = useState("")
  const [baths, setBaths] = useState("")
  const [sqft, setSqft] = useState("")
  const [parking, setParking] = useState("")

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  
  // Images
  const [images, setImages] = useState<{ file: File; preview: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      
      const newImages = selectedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      
      setImages((prev) => [...prev, ...newImages].slice(0, 10)) // Max 10 images
    }
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const handleUseMyLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser.")
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude)
        setLongitude(pos.coords.longitude)
        setIsLocating(false)
        toast.success("Location captured — it will be saved with this listing.")
      },
      (err) => {
        setIsLocating(false)
        toast.error(err.message || "Could not read your location. Check permissions and try again.")
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    )
  }

  const handleClearLocation = () => {
    setLatitude(null)
    setLongitude(null)
    toast.message("Map pin cleared")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !price || !type || !propertyKind || !state) {
        toast.error("Please fill in all required fields (marked * on form if added, else check your inputs).")
        return
    }

    setIsSubmitting(true)
    try {
      let uploadedImagesUrls: Array<{ url: string; publicId: string }> = []
      
      if (images.length > 0) {
        toast.loading("Uploading images...", { id: "upload" })
        const filesToUpload = images.map((img) => img.file)
        uploadedImagesUrls = await propertyService.uploadImages(filesToUpload)
        toast.success("Images uploaded successfully!", { id: "upload" })
      }

      const payload: Record<string, unknown> = {
        title,
        description,
        price: Number(price),
        type,
        propertyKind,
        address,
        city,
        area,
        state,
        beds: beds ? Number(beds) : undefined,
        baths: baths ? Number(baths) : undefined,
        sqft: sqft ? Number(sqft) : undefined,
        parking: parking ? Number(parking) : undefined,
        paymentPeriod: paymentPeriod || undefined,
        features: selectedAmenities,
        images: uploadedImagesUrls,
      }
      if (latitude != null && longitude != null) {
        payload.latitude = latitude
        payload.longitude = longitude
      }

      toast.loading("Creating property...", { id: "create" })
      await propertyService.createProperty(payload)
      toast.success("Property created successfully!", { id: "create" })
      
      router.push("/dashboard/vendor/properties")
    } catch (error: any) {
      console.error("Property creation error:", error)
      toast.error(error.response?.data?.message || "Failed to create property")
      toast.dismiss("upload")
      toast.dismiss("create")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link
          href="/dashboard/vendor/properties"
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
                <Label htmlFor="title">Property Title <span className="text-red-500">*</span></Label>
                <Input id="title" placeholder="e.g., Luxury 4-Bedroom Duplex with Pool" className="mt-1.5" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property in detail..."
                  rows={4}
                  className="mt-1.5"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Listing Type <span className="text-red-500">*</span></Label>
                  <Select defaultValue={type} onValueChange={setType}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select listing type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <div className="flex items-center gap-2">
                            <t.icon className="w-4 h-4" />
                            {t.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Property Kind <span className="text-red-500">*</span></Label>
                  <Select defaultValue={propertyKind} onValueChange={setPropertyKind}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyKinds.map((pk) => (
                          <SelectItem key={pk.value} value={pk.value}>
                              {pk.label}
                          </SelectItem>
                      ))}
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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Map coordinates</p>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
                    Use your device GPS so buyers can see this listing on a map later. You can skip this and add it when editing the property if needed.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={handleUseMyLocation}
                    disabled={isLocating}
                  >
                    {isLocating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Crosshair className="h-4 w-4" />
                    )}
                    Use my location
                  </Button>
                  {(latitude != null || longitude != null) && (
                    <Button type="button" variant="ghost" size="sm" onClick={handleClearLocation}>
                      Clear pin
                    </Button>
                  )}
                </div>
              </div>
              {latitude != null && longitude != null && (
                <>
                  <p className="text-xs font-mono text-muted-foreground">
                    Latitude {latitude.toFixed(6)}, longitude {longitude.toFixed(6)}
                  </p>
                  <PropertyLocationPreview latitude={latitude} longitude={longitude} />
                </>
              )}
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" placeholder="e.g., 15 Admiralty Way" className="mt-1.5" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="e.g., Lagos" className="mt-1.5" value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="area">Area/District</Label>
                  <Input id="area" placeholder="e.g., Lekki Phase 1" className="mt-1.5" value={area} onChange={e => setArea(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                  <Select defaultValue={state} onValueChange={setState}>
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
                  <Label htmlFor="price">Price (₦) <span className="text-red-500">*</span></Label>
                  <Input id="price" type="number" placeholder="e.g., 85000000" className="mt-1.5" value={price} onChange={e => setPrice(e.target.value)} required min="1" />
                </div>
                {(type === "rent" || type === "shortlet") && (
                  <div>
                    <Label>Payment Period</Label>
                    <Select defaultValue={paymentPeriod} onValueChange={setPaymentPeriod}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yearly">Per Year</SelectItem>
                        <SelectItem value="monthly">Per Month</SelectItem>
                        <SelectItem value="daily">Per Day</SelectItem>
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
                  <Input id="beds" type="number" min="0" placeholder="0" className="mt-1.5" value={beds} onChange={e => setBeds(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="baths" className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-muted-foreground" />
                    Bathrooms
                  </Label>
                  <Input id="baths" type="number" min="0" placeholder="0" className="mt-1.5" value={baths} onChange={e => setBaths(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="sqft" className="flex items-center gap-2">
                    <Maximize className="w-4 h-4 text-muted-foreground" />
                    Size (m²)
                  </Label>
                  <Input id="sqft" type="number" min="0" placeholder="0" className="mt-1.5" value={sqft} onChange={e => setSqft(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="parking" className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    Parking
                  </Label>
                  <Input id="parking" type="number" min="0" placeholder="0" className="mt-1.5" value={parking} onChange={e => setParking(e.target.value)} />
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
                    className="flex items-center space-x-2"
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
              <div 
                className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  multiple 
                  accept="image/png, image/jpeg, image/webp" 
                  onChange={handleImageSelect}
                />
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-1">Drag and drop your images here, or click to browse</p>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB (max 10 images)</p>
                <Button variant="outline" className="mt-4 gap-2 bg-transparent" type="button">
                  <Plus className="w-4 h-4" />
                  Add Images
                </Button>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <img src={image.preview} alt="Preview" className="object-cover w-full h-full" />
                      <Button
                        variant="destructive"
                        size="icon"
                        type="button"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          setImages(images.filter((_, i) => i !== index))
                        }}
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
            <Link href="/dashboard/vendor/properties">
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
