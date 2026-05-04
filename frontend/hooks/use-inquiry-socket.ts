"use client"

import { useEffect, useRef } from "react"
import { createInquirySocket } from "@/lib/inquiry-socket"
import type { Inquiry } from "@/services/inquiry.service"

type InquiryUpdatedPayload = { inquiry: Inquiry }

/**
 * Subscribes to inquiry thread updates for the signed-in user (same JWT as REST).
 */
export function useInquirySocket(onInquiryUpdated: (inquiry: Inquiry) => void) {
  const handlerRef = useRef(onInquiryUpdated)
  handlerRef.current = onInquiryUpdated

  useEffect(() => {
    if (typeof window === "undefined") return
    const token = localStorage.getItem("accessToken")
    if (!token) return

    const socket = createInquirySocket(token)
    const listener = (payload: InquiryUpdatedPayload) => {
      handlerRef.current(payload.inquiry)
    }
    socket.on("inquiry:updated", listener)
    return () => {
      socket.off("inquiry:updated", listener)
      socket.disconnect()
    }
  }, [])
}
