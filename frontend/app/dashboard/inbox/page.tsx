"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, Star, MoreHorizontal, Send, Paperclip, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const conversations = [
  {
    id: 1,
    name: "Adaeze Nwosu",
    avatar: "/nigerian-woman-professional-portrait.jpg",
    lastMessage: "I'm very interested in the Lekki duplex. Is it still available?",
    time: "2m ago",
    unread: true,
    property: "Luxury 4-Bedroom Duplex",
    phone: "+234 803 456 7890",
    email: "adaeze.nwosu@email.com",
  },
  {
    id: 2,
    name: "Emeka Obi",
    avatar: "/nigerian-man-business-portrait.jpg",
    lastMessage: "Can we schedule a viewing for Saturday?",
    time: "1h ago",
    unread: true,
    property: "Modern 3-Bedroom Apartment",
    phone: "+234 805 123 4567",
    email: "emeka.obi@email.com",
  },
  {
    id: 3,
    name: "Fatima Abdullahi",
    avatar: "/nigerian-woman-hijab-professional.jpg",
    lastMessage: "Thank you for the information. I'll get back to you.",
    time: "3h ago",
    unread: false,
    property: "Executive 5-Bedroom Mansion",
    phone: "+234 806 789 0123",
    email: "fatima.a@email.com",
  },
  {
    id: 4,
    name: "Kunle Adeyemi",
    avatar: "/young-nigerian-man-casual-portrait.jpg",
    lastMessage: "What's the best price you can offer?",
    time: "Yesterday",
    unread: false,
    property: "Smart Home Apartment",
    phone: "+234 807 234 5678",
    email: "kunle.adeyemi@email.com",
  },
]

const messages = [
  {
    id: 1,
    sender: "client",
    text: "Hello, I saw your listing for the Luxury 4-Bedroom Duplex in Lekki Phase 1. Is it still available?",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "agent",
    text: "Good morning! Yes, the property is still available. It's one of our premium listings with excellent features including a private pool and smart home system.",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "client",
    text: "That sounds great! What's the asking price and are there any additional costs I should be aware of?",
    time: "10:35 AM",
  },
  {
    id: 4,
    sender: "agent",
    text: "The asking price is ₦85,000,000. This is all-inclusive with no hidden fees. We also offer flexible payment plans if needed.",
    time: "10:38 AM",
  },
  {
    id: 5,
    sender: "client",
    text: "I'm very interested in the Lekki duplex. Is it still available?",
    time: "10:42 AM",
  },
]

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.property.toLowerCase().includes(searchQuery.toLowerCase()),
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
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`
                  flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors
                  ${selectedConversation.id === conversation.id ? "bg-accent/10" : "hover:bg-muted"}
                `}
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src={conversation.avatar || "/placeholder.svg"}
                    alt={conversation.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  {conversation.unread && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-medium truncate ${
                        conversation.unread ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {conversation.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">{conversation.lastMessage}</p>
                  <Badge variant="secondary" className="mt-1.5 text-xs">
                    {conversation.property}
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
        {/* Chat Header */}
        <div className="h-16 px-6 border-b flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <Image
              src={selectedConversation.avatar || "/placeholder.svg"}
              alt={selectedConversation.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h2 className="font-medium text-foreground">{selectedConversation.name}</h2>
              <p className="text-xs text-muted-foreground">{selectedConversation.property}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Mail className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Star className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Today
              </Badge>
            </div>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`
                    max-w-[80%] rounded-2xl px-4 py-3
                    ${
                      message.sender === "agent"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }
                  `}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "agent" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

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
            <Button className="bg-accent hover:bg-accent-hover text-primary flex-shrink-0" size="icon">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
