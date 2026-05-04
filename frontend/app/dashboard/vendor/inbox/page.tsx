"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Send, Paperclip, Phone, Mail, Clock, Loader2, CheckCircle, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { inquiryService, Inquiry } from "@/services/inquiry.service"
import { useInquirySocket } from "@/hooks/use-inquiry-socket"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)



export default function InboxPage() {
  const { user } = useAuth()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Inquiry | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isSendingReply, setIsSendingReply] = useState(false)

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setIsLoading(true)
        const response = await inquiryService.getInbox(1, 100)
        const validInquiries = response.inquiries.reverse()
        setInquiries(validInquiries)
        if (validInquiries.length > 0) {
            setSelectedConversation(validInquiries[0])
        }
      } catch (error) {
        console.error("Failed to load inbox:", error)
        toast.error("Error loading inbox messages")
      } finally {
        setIsLoading(false)
      }
    }
    fetchInquiries()
  }, [user?.id])

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
    setSelectedConversation((prev) => {
      if (!prev) return prev
      if ((prev.id || prev._id) === id) return inquiry
      return prev
    })
  })

  const handleStatusUpdate = async (status: string) => {
    if (!selectedConversation) return
    try {
      setIsUpdatingStatus(true)
      const inquiryId = selectedConversation.id || selectedConversation._id
      if (!inquiryId) return
      await inquiryService.updateInquiryStatus(inquiryId, status)
      setInquiries(inquiries.map(c => (c.id || c._id) === inquiryId ? { ...c, status } : c))
      setSelectedConversation({ ...selectedConversation, status })
      toast.success(`Inquiry marked as ${status}`)
    } catch (e) {
      toast.error("Failed to update status")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleReply = async () => {
    if (!selectedConversation) return
    const inquiryId = selectedConversation.id || selectedConversation._id
    if (!inquiryId || !messageText.trim()) return
    try {
      setIsSendingReply(true)
      const updated = await inquiryService.sendMessage(inquiryId, messageText.trim())
      setSelectedConversation(updated)
      setInquiries(inquiries.map((c) => ((c.id || c._id) === inquiryId ? updated : c)))
      setMessageText("")
      toast.success("Reply sent successfully")
    } catch (error) {
      toast.error("Failed to send reply")
    } finally {
      setIsSendingReply(false)
    }
  }

  const filteredConversations = inquiries.filter(
    (c) =>
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof c.property === 'object' ? c.property?.title : '')?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen flex">
      {/* Conversations List */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full sm:w-80 lg:w-96 border-r bg-card flex flex-col"
      >
        <div className="p-4 border-b">
          <h1 className="font-heading text-xl font-bold text-foreground mb-4">Inbox</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {isLoading ? (
               <div className="flex justify-center py-10">
                 <Loader2 className="w-8 h-8 animate-spin text-accent" />
               </div>
            ) : filteredConversations.length === 0 ? (
               <div className="text-center text-muted-foreground p-6 text-sm">No messages found.</div>
            ) : filteredConversations.map((conversation) => (
              <div
                key={conversation.id || conversation._id}
                onClick={() => setSelectedConversation(conversation)}
                className={`
                  flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors
                  ${(selectedConversation?.id || selectedConversation?._id) === (conversation.id || conversation._id) ? "bg-accent/10" : "hover:bg-muted"}
                `}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-lg">
                      {(conversation.name || 'U')[0].toUpperCase()}
                  </div>
                  {conversation.status === "pending" && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-medium truncate ${
                        conversation.status === "pending" ? "text-foreground font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {conversation.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{dayjs(conversation.createdAt).fromNow(true)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">{conversation.message}</p>
                  <Badge variant="secondary" className="mt-1.5 text-xs truncate max-w-full">
                    {typeof conversation.property === 'object' ? conversation.property.title : "Property"}
                  </Badge>
                </div>
              </div>
            ))}
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
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-6 border-b flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center font-bold">
                    {(selectedConversation.name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="font-medium text-foreground">{selectedConversation.name}</h2>
                  <p className="text-xs text-muted-foreground">{typeof selectedConversation.property === 'object' ? selectedConversation.property.title : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground" title="Call">
                  <Phone className="w-5 h-5" />
                </Button>
                {selectedConversation.status !== 'closed' && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 hidden md:flex"
                        onClick={() => handleStatusUpdate('responded')}
                        disabled={isUpdatingStatus}
                    >
                        {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                        Mark Responded
                    </Button>
                )}
                {selectedConversation.status !== 'closed' && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-red-500 hidden md:flex"
                        onClick={() => handleStatusUpdate('closed')}
                        disabled={isUpdatingStatus}
                    >
                        <Archive className="w-4 h-4 mr-1" />
                        Close
                    </Button>
                )}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="flex justify-center">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {dayjs(selectedConversation.createdAt).format("MMMM D, YYYY")}
                  </Badge>
                </div>
                
                {(selectedConversation.messages?.length
                  ? selectedConversation.messages
                  : [{ senderRole: "buyer", body: selectedConversation.message, createdAt: selectedConversation.createdAt }]
                ).map((msg, idx) => {
                  const isAgent = msg.senderRole === "agent" || msg.senderRole === "admin"
                  return (
                    <div key={`${msg.createdAt}-${idx}`} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isAgent ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
                        <p className="text-sm">{msg.body}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {dayjs(msg.createdAt).format("h:mm A")}
                        </p>
                      </div>
                    </div>
                  )
                })}

              </div>
            </ScrollArea>
           </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
               <Mail className="w-12 h-12 mb-4 opacity-20" />
               <p>Select a conversation to view.</p>
            </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex items-end gap-3 max-w-3xl mx-auto">
            <Button variant="ghost" size="icon" className="text-muted-foreground flex-shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Textarea
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            <Button
              className="bg-accent hover:bg-accent-hover text-primary flex-shrink-0"
              size="icon"
              onClick={handleReply}
              disabled={isSendingReply || !messageText.trim() || !selectedConversation}
            >
              {isSendingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
