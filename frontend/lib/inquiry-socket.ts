import { io, Socket } from "socket.io-client"

export function getInquirySocketOrigin(): string {
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
  try {
    return new URL(api).origin
  } catch {
    return "http://localhost:8080"
  }
}

export function createInquirySocket(accessToken: string): Socket {
  const origin = getInquirySocketOrigin()
  return io(`${origin}/inquiries`, {
    auth: { token: accessToken },
    transports: ["websocket", "polling"],
    withCredentials: true,
  })
}
