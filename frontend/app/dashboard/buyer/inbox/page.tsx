"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, MoreHorizontal, Send, Paperclip, Phone, Mail, Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const conversations = [
  {
    id: 1,
    name: "Chidi Okonkwo",
    role: "Listing Agent",
    agency: "Vantage Realty",
    avatar: "/professional-nigerian-real-estate-agent-portrait.jpg",
    lastMessage: "The property at Lekki Phase 1 is available for viewing this Saturday.",
    time: "2m ago",
    unread: true,
    property: "Luxury 4-Bedroom Duplex",
    phone: "+234 801 234 5678",
    email: "chidi.okonkwo@vantage.com",
    online: true,
  },
  {
    id: 2,
    name: "Amaka Eze",
    role: "Property Manager",
    agency: "Lagos Homes",
    avatar: "/nigerian-woman-professional-portrait.jpg",
    lastMessage: "I've sent the tenancy agreement for your review.",
    time: "1h ago",
    unread: false,
    property: "Modern 3-Bedroom Apartment",
    phone: "+234 802 345 6789",
    email: "amaka.eze@lagoshomes.com",
    online: false,
  },
  {
    id: 3,
    name: "Tunde Bakare",
    role: "Real Estate Agent",
    agency: "Island Properties",
    avatar: "/nigerian-man-business-portrait.jpg",
    lastMessage: "Let me know if you need more details about the Banana Island mansion.",
    time: "1d ago",
    unread: false,
    property: "Executive 5-Bedroom Mansion",
    phone: "+234 803 456 7890",
    email: "tunde.b@islandproperties.com",
    online: false,
  },
]

const messages = [
  {
    id: 1,
    sender: "me",
    text: "Hello, I'm interested in the Luxury 4-Bedroom Duplex. Is it still available?",
    time: "10:30 AM",
    status: "read",
  },
  {
    id: 2,
    sender: "agent",
    text: "Good morning! Yes, it is. It's a fantastic property. Would you like to schedule a viewing?",
    time: "10:32 AM",
    status: "read",
  },
  {
    id: 3,
    sender: "me",
    text: "Yes, I'm free this weekend. Saturday works best for me.",
    time: "10:35 AM",
    status: "read",
  },
  {
    id: 4,
    sender: "agent",
    text: "Great! How does 10:00 AM sound?",
    time: "10:36 AM",
    status: "read",
  },
  {
    id: 5,
    sender: "agent",
    text: "The property at Lekki Phase 1 is available for viewing this Saturday.",
    time: "10:38 AM",
    status: "delivered",
  },
]

export default function BuyerInboxPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.property.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`
                  flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors
                  ${selectedConversation.id === conversation.id ? "bg-accent/10 border border-accent/20" : "hover:bg-muted border border-transparent"}
                `}
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src={conversation.avatar || "/placeholder.svg"}
                    alt={conversation.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-medium truncate ${conversation.unread ? "text-foreground font-bold" : "text-foreground"}`}>
                      {conversation.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{conversation.time}</span>
                  </div>
                  <p className={`text-sm truncate mt-0.5 ${conversation.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {conversation.lastMessage}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-normal">
                        {conversation.role}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground truncate">• {conversation.property}</span>
                  </div>
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
        {/* Chat Header */}
        <div className="h-16 px-6 border-b flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="relative">
                <Image
                src={selectedConversation.avatar || "/placeholder.svg"}
                alt={selectedConversation.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
                />
                {selectedConversation.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />
                )}
            </div>
            <div>
              <h2 className="font-medium text-foreground">{selectedConversation.name}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {selectedConversation.agency} • {selectedConversation.role}
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
                Today, December 13
              </Badge>
            </div>
            
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`flex flex-col ${message.sender === "me" ? "items-end" : "items-start"} max-w-[75%]`}>
                    <div
                    className={`
                        rounded-2xl px-4 py-3 shadow-sm
                        ${
                        message.sender === "me"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-white border text-foreground rounded-bl-none"
                        }
                    `}
                    >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1">
                        <span className="text-[10px] text-muted-foreground">{message.time}</span>
                        {message.sender === "me" && (
                            <Check className="w-3 h-3 text-emerald-500" />
                        )}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-card">
          <div className="max-w-3xl mx-auto bg-background border rounded-xl flex items-end p-2 gap-2 shadow-sm focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-10 w-10 flex-shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Textarea
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="border-0 focus-visible:ring-0 min-h-[44px] max-h-32 resize-none py-2.5 px-0 bg-transparent flex-1"
              rows={1}
            />
            <Button className="bg-accent hover:bg-accent-hover text-primary h-10 w-10 flex-shrink-0 rounded-lg" size="icon">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
