"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, MoreHorizontal, Send, Paperclip, Phone, Mail, Clock, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { inquiryService, Inquiry } from "@/services/inquiry.service"
import { useInquirySocket } from "@/hooks/use-inquiry-socket"
import { toast } from "sonner"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export default function BuyerInboxPage() {
  const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)

  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchInquiries = async () => {
    try {
      setIsLoading(true)
      const data = await inquiryService.getInbox(1, 50)
      setInquiries(data.inquiries)
      if (data.inquiries.length > 0) {
        setSelectedInquiry(data.inquiries[0])
      }
    } catch (error) {
      console.error("Failed to load inbox:", error)
      toast.error("Failed to load messages")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  useInquirySocket((inquiry) => {
    const id = inquiry.id || inquiry._id
    if (!id) return
    setInquiries((prev) => {
      const idx = prev.findIndex((i) => (i.id || i._id) === id)
      if (idx === -1) return [inquiry, ...prev]
      const next = [...prev]
      next[idx] = inquiry
      return next
    })
    setSelectedInquiry((prev) => {
      if (!prev) return prev
      if ((prev.id || prev._id) === id) return inquiry
      return prev
    })
  })

  const handleSendMessage = async () => {
    if (!selectedInquiry || !messageText.trim()) return
    const inquiryId = selectedInquiry.id || selectedInquiry._id
    if (!inquiryId) return
    try {
      setIsSending(true)
      const updated = await inquiryService.sendMessage(inquiryId, messageText.trim())
      setInquiries((prev) => prev.map((inq) => ((inq.id || inq._id) === inquiryId ? updated : inq)))
      setSelectedInquiry(updated)
      setMessageText("")
    } catch (error) {
      toast.error("Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  const filteredInquiries = inquiries.filter((inquiry) => {
    const propName = typeof inquiry.property === 'object' ? inquiry.property.title : String(inquiry.property)
    return (
      propName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.status.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen flex bg-background">
      {/* Conversations List Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full sm:w-80 lg:w-96 border-r bg-card flex flex-col"
      >
        <div className="p-4 border-b">
          <h1 className="font-heading text-xl font-bold text-foreground mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {isLoading ? (
               <div className="flex justify-center p-8">
                 <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
               </div>
            ) : filteredInquiries.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground text-sm">
                    No inquiries found.
                </div>
            ) : filteredInquiries.map((inquiry) => {
              const propTitle = typeof inquiry.property === 'object' ? inquiry.property.title : `Property ${inquiry.property}`
              const isSelected = (selectedInquiry?.id || selectedInquiry?._id) === (inquiry.id || inquiry._id)
              
              return (
              <div
                key={inquiry.id || inquiry._id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={`
                  flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors
                  ${isSelected ? "bg-accent/10 border border-accent/20" : "hover:bg-muted border border-transparent"}
                `}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {propTitle.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-medium truncate ${isSelected ? "text-foreground font-bold" : "text-foreground"}`}>
                      {propTitle}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                        {dayjs(inquiry.createdAt).fromNow(true)}
                    </span>
                  </div>
                  <p className={`text-sm truncate mt-0.5 ${isSelected ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {inquiry.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-normal capitalize">
                        {inquiry.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground truncate capitalize">• Inquiry</span>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </ScrollArea>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="hidden sm:flex flex-1 flex-col bg-background"
      >
        {/* Chat Header */}
        {selectedInquiry ? (
            <>
        <div className="h-16 px-6 border-b flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {typeof selectedInquiry.property === 'object' ? selectedInquiry.property.title.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <h2 className="font-medium text-foreground truncate">
                {typeof selectedInquiry.property === 'object' ? selectedInquiry.property.title : `Property ${selectedInquiry.property}`}
              </h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1 capitalize">
                Status: {selectedInquiry.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Mail className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6 bg-slate-50/50">
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground bg-background">
                <Clock className="w-3 h-3 mr-1" />
                {dayjs(selectedInquiry.createdAt).format('MMMM D, YYYY')}
              </Badge>
            </div>
            
            {(selectedInquiry.messages?.length
              ? selectedInquiry.messages
              : [{ senderRole: "buyer", body: selectedInquiry.message, createdAt: selectedInquiry.createdAt }]
            ).map((msg, idx) => {
              const isBuyer = msg.senderRole === "buyer"
              return (
                <div key={`${msg.createdAt}-${idx}`} className={`flex ${isBuyer ? "justify-end" : "justify-start"}`}>
                  <div className={`flex flex-col max-w-[75%] ${isBuyer ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        isBuyer
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-white text-foreground rounded-bl-none border"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.body}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-[10px] text-muted-foreground">{dayjs(msg.createdAt).format("h:mm A")}</span>
                      {isBuyer && <Check className="w-3 h-3 text-emerald-500" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
        </>
        ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Select an inquiry to view details</p>
            </div>
        )}

        <div className="p-4 border-t bg-card">
          <div className="max-w-3xl mx-auto bg-background border rounded-xl flex items-end p-2 gap-2 shadow-sm focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-10 w-10 shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Textarea
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="border-0 focus-visible:ring-0 min-h-[44px] max-h-32 resize-none py-2.5 px-0 bg-transparent flex-1"
              rows={1}
            />
            <Button
              className="bg-accent hover:bg-accent-hover text-primary h-10 w-10 shrink-0 rounded-lg"
              size="icon"
              disabled={!selectedInquiry || !messageText.trim() || isSending}
              onClick={handleSendMessage}
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
