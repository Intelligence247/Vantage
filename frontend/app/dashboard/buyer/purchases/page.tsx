"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Loader2,
  MapPin,
  ExternalLink,
  Receipt,
  Mail,
  Phone,
  Info,
  BadgeCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { paymentService, PurchaseRecord } from "@/services/payment.service"
import { Property } from "@/services/property.service"
import { toast } from "sonner"
import dayjs from "dayjs"

function propertyFromPurchase(p: PurchaseRecord): Property | null {
  const raw = p.property
  if (!raw || typeof raw === "string") return null
  return raw as Property
}

function propertyId(p: PurchaseRecord): string | undefined {
  const prop = propertyFromPurchase(p)
  return prop?.id ?? prop?._id ?? (typeof p.property === "string" ? p.property : undefined)
}

export default function MyPurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setIsLoading(true)
        const data = await paymentService.getPurchases()
        if (mounted) setPurchases(data)
      } catch (e) {
        console.error(e)
        toast.error("Could not load your purchases")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("NGN", "₦")
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">My purchases</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Properties you have paid for through Vantage. Each entry is your payment receipt; use it when coordinating
          documentation and handover with the listing agent.
        </p>
      </motion.div>

      <Alert className="mb-8 border-accent/30 bg-accent/5">
        <Info className="h-4 w-4 text-accent" />
        <AlertTitle className="text-foreground font-semibold">How transfer & handover work</AlertTitle>
        <AlertDescription className="text-muted-foreground text-sm leading-relaxed mt-1">
          Vantage processes your payment and records the sale. Legal title transfer, keys, and any government
          registrations are completed between you and the agent or your lawyers outside the app. Use the agent
          contact on each purchase to arrange next steps. Keep your Paystack reference and the receipt email for
          your records.
        </AlertDescription>
      </Alert>

      {purchases.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-60" />
            <p className="text-foreground font-medium">No purchases yet</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              When you complete checkout on a listing, your settled payments will appear here with listing and agent
              details.
            </p>
            <Button className="mt-6 bg-accent hover:bg-accent-hover text-primary" asChild>
              <Link href="/properties">Browse properties</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {purchases.map((purchase, index) => {
            const prop = propertyFromPurchase(purchase)
            const pid = propertyId(purchase)
            const vendor = purchase.vendor
            const paidAt = purchase.updatedAt || purchase.createdAt

            return (
              <motion.div
                key={purchase.reference || index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="grid md:grid-cols-[280px_1fr] gap-0">
                    <div className="relative h-48 md:h-auto md:min-h-[200px] bg-muted">
                      <Image
                        src={prop?.images?.[0]?.url || "/placeholder.svg"}
                        alt={prop?.title || "Property"}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-emerald-600 text-white border-0 gap-1">
                          <BadgeCheck className="w-3.5 h-3.5" />
                          Paid
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h2 className="font-heading text-xl font-semibold text-foreground">
                              {prop?.title || "Property"}
                            </h2>
                            {prop?.city && (
                              <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <MapPin className="w-4 h-4 shrink-0" />
                                {[prop.address, prop.city, prop.state].filter(Boolean).join(", ")}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-heading text-lg font-bold text-foreground">
                              {formatPrice(purchase.amount)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">Amount paid</p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-mono">
                            Ref: {purchase.reference}
                          </span>
                          {paidAt && (
                            <span className="inline-flex items-center rounded-md bg-muted px-2 py-1">
                              Settled {dayjs(paidAt).format("MMM D, YYYY h:mm A")}
                            </span>
                          )}
                        </div>

                        {vendor && (vendor.name || vendor.email || vendor.phone) && (
                          <div className="mt-6 pt-4 border-t border-border">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                              Listing agent
                            </p>
                            <p className="font-medium text-foreground">{vendor.name || "Agent"}</p>
                            <div className="mt-2 flex flex-wrap gap-3 text-sm">
                              {vendor.email && (
                                <a
                                  href={`mailto:${vendor.email}`}
                                  className="inline-flex items-center gap-1.5 text-accent hover:underline"
                                >
                                  <Mail className="w-4 h-4 shrink-0" />
                                  {vendor.email}
                                </a>
                              )}
                              {vendor.phone && (
                                <a
                                  href={`tel:${vendor.phone}`}
                                  className="inline-flex items-center gap-1.5 text-foreground hover:text-accent"
                                >
                                  <Phone className="w-4 h-4 shrink-0" />
                                  {vendor.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {pid && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/properties/${pid}`}>
                              View listing
                              <ExternalLink className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/dashboard/buyer/inbox">Message inbox</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
