"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function Dashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.replace("/login")
      return
    }
    if (user.role === "admin") {
      router.replace("/dashboard/admin")
      return
    }
    if (user.role === "agent") {
      router.replace("/dashboard/vendor")
      return
    }
    router.replace("/dashboard/buyer")
  }, [user, isLoading, router])

  return null
}
