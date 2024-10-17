"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { NavBar } from "@/components/component/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  Search,
  MoreHorizontal,
  Phone,
  Video,
  Paperclip,
  Smile,
  Send,
  UserX,
  User,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  lastMessage: string;
  timestamp: string;
  status: "online" | "offline" | "busy";
  lastSeen?: string;
  unreadCount: number;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    user: { name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
    lastMessage: "Hey, how's it going?",
    timestamp: "2023-06-16T10:30:00Z",
    status: "online",
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        content: "Hey, how's it going?",
        sender: "Alice",
        timestamp: "2023-06-16T10:30:00Z",
      },
    ],
  },
  {
    id: "2",
    user: { name: "Bob Smith", avatar: "https://i.pravatar.cc/150?img=2" },
    lastMessage: "Did you see the latest AI paper?",
    timestamp: "2023-06-16T09:45:00Z",
    status: "busy",
    lastSeen: "2023-06-16T10:15:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "m2",
        content: "Did you see the latest AI paper?",
        sender: "Bob",
        timestamp: "2023-06-16T09:45:00Z",
      },
    ],
  },
  {
    id: "3",
    user: { name: "Charlie Brown", avatar: "https://i.pravatar.cc/150?img=3" },
    lastMessage: "Let's catch up soon!",
    timestamp: "2023-06-15T18:20:00Z",
    status: "offline",
    lastSeen: "2023-06-16T08:30:00Z",
    unreadCount: 5,
    messages: [
      {
        id: "m3",
        content: "Let's catch up soon!",
        sender: "Charlie",
        timestamp: "2023-06-15T18:20:00Z",
      },
    ],
  },
];

const emojis = ["😀", "😂", "😍", "🤔", "👍", "👎", "🎉", "🔥", "💯", "🚀"];

export default function Messaging() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [userStatus, setUserStatus] = useState<"online" | "busy" | "offline">(
    "online"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const conversationId = searchParams.get("conversationId");
    if (conversationId) {
      const conversation = conversations.find(
        (conv) => conv.id === conversationId
      );
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [searchParams, conversations]);

  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: "online" | "offline" | "busy") => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "busy":
        return "bg-yellow-500";
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation) {
      const newMessageObj: Message = {
        id: `m${Date.now()}`,
        content: newMessage,
        sender: "You",
        timestamp: new Date().toISOString(),
      };
      const updatedConversation = {
        ...selectedConversation,
        lastMessage: newMessage,
        timestamp: new Date().toISOString(),
        messages: [...selectedConversation.messages, newMessageObj],
      };
      setConversations(
        conversations.map((conv) =>
          conv.id === selectedConversation.id ? updatedConversation : conv
        )
      );
      setSelectedConversation(updatedConversation);
      setNewMessage("");
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    router.push(`/messages?conversationId=${conversation.id}`);
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
    setShowEmojiPicker(false);
  };

  const handleBlockUser = () => {
    if (selectedConversation) {
      // Implement block user logic here
      console.log(`Blocked user: ${selectedConversation.user.name}`);
      // Remove the conversation from the list
      setConversations(
        conversations.filter((conv) => conv.id !== selectedConversation.id)
      );
      setSelectedConversation(null);
    }
  };

  const handleSeeProfile = () => {
    if (selectedConversation) {
      // Implement see profile logic here
      console.log(`Viewing profile of: ${selectedConversation.user.name}`);
      // Navigate to user profile page (you'll need to create this page)
      router.push(`/profile/${selectedConversation.user.name}`);
    }
  };

  const handleSendCrypto = () => {
    if (selectedConversation) {
      // Implement send crypto logic here
      console.log(`Sending crypto to: ${selectedConversation.user.name}`);
      // Open a modal or navigate to a page for sending crypto (you'll need to create this)
      router.push(`/send-crypto/${selectedConversation.user.name}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <NavBar />
      <div className="flex-grow flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link href="/forum" passHref>
              <Button variant="ghost" className="text-gray-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Forum
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={userStatus}
              onValueChange={(value: "online" | "busy" | "offline") =>
                setUserStatus(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Set your status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-gray-800" value="online">
                  <div className="flex items-center">
                    <motion.div
                      className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(
                        "online"
                      )}`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                    />
                    Online
                  </div>
                </SelectItem>
                <SelectItem className="text-gray-800" value="busy">
                  <div className="flex items-center">
                    <motion.div
                      className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(
                        "busy"
                      )}`}
                    />
                    Busy
                  </div>
                </SelectItem>
                <SelectItem className="text-gray-800" value="offline">
                  <div className="flex items-center">
                    <motion.div
                      className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(
                        "offline"
                      )}`}
                    />
                    Offline
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-1 flex flex-col">
            <CardContent className="flex-grow flex flex-col p-4">
              <div className="mb-4">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <ScrollArea className="flex-grow">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex items-center space-x-4 p-3 cursor-pointer hover:bg-gray-100 rounded-lg ${
                        selectedConversation?.id === conversation.id
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => handleConversationClick(conversation)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage
                            src={conversation.user.avatar}
                            alt={conversation.user.name}
                          />
                          <AvatarFallback>
                            {conversation.user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <motion.div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor(
                            conversation.status
                          )}`}
                          animate={{
                            scale:
                              conversation.status === "online"
                                ? [1, 1.2, 1]
                                : 1,
                          }}
                          transition={{
                            repeat:
                              conversation.status === "online" ? Infinity : 0,
                            duration: 2,
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">
                          {conversation.user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        <p>
                          {format(new Date(conversation.timestamp), "HH:mm")}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center mt-1">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Image
                      src="/angry.png"
                      alt="BlockchainML"
                      className="w-24 h-24 mb-4"
                      width={100}
                      height={100}
                    />
                    <p className="text-lg font-semibold">
                      No conversations found
                    </p>
                    <p className="text-sm">Time to make some friends!</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 flex flex-col">
            <CardContent className="flex-grow flex flex-col p-4">
              {selectedConversation ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage
                            src={selectedConversation.user.avatar}
                            alt={selectedConversation.user.name}
                          />
                          <AvatarFallback>
                            {selectedConversation.user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <motion.div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor(
                            selectedConversation.status
                          )}`}
                          animate={{
                            scale:
                              selectedConversation.status === "online"
                                ? [1, 1.2, 1]
                                : 1,
                          }}
                          transition={{
                            repeat:
                              selectedConversation.status === "online"
                                ? Infinity
                                : 0,
                            duration: 2,
                          }}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">
                          {selectedConversation.user.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.status === "online"
                            ? "Online"
                            : selectedConversation.lastSeen
                            ? `Last seen ${formatDistanceToNow(
                                new Date(selectedConversation.lastSeen),
                                { addSuffix: true }
                              )}`
                            : "Offline"}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Phone className="h-4  w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Start voice call</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Video className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Start video call</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56">
                          <div className="flex flex-col space-y-1">
                            <Button
                              variant="ghost"
                              onClick={handleBlockUser}
                              className="justify-start"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Block User
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={handleSeeProfile}
                              className="justify-start"
                            >
                              <User className="mr-2 h-4 w-4" />
                              See Profile
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={handleSendCrypto}
                              className="justify-start"
                            >
                              <DollarSign className="mr-2 h-4 w-4" />
                              Send Crypto
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <ScrollArea className="flex-grow mb-4 p-4 bg-gray-50 rounded-lg">
                    {selectedConversation.messages.length > 0 ? (
                      selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`mb-4 flex ${
                            message.sender === "You"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                              message.sender === "You"
                                ? "bg-green-500 text-white rounded-br-none"
                                : "bg-white text-gray-800 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {format(new Date(message.timestamp), "HH:mm")}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500">
                        <p className="mb-2">
                          All messages are encrypted. Chat securely with your
                          friends.
                        </p>
                        <Image
                          src="/angry.png"
                          width={60}
                          height={60}
                          alt="lock"
                          className="mx-auto"
                        />
                      </div>
                    )}
                  </ScrollArea>
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center space-x-2"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button type="button" variant="ghost" size="icon">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Attach file</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-grow"
                    />
                    <Popover
                      open={showEmojiPicker}
                      onOpenChange={setShowEmojiPicker}
                    >
                      <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="icon">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="grid grid-cols-5 gap-2">
                          {emojis.map((emoji) => (
                            <Button
                              key={emoji}
                              variant="ghost"
                              className="text-2xl"
                              onClick={() => handleEmojiSelect(emoji)}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
                  <Image
                    width={100}
                    height={100}
                    src="/angry.png"
                    alt="BlockchainML"
                    className="w-32 h-32 mb-4 animate-bounce"
                  />
                  <p className="text-xl font-semibold mb-2">
                    No conversation selected
                  </p>
                  <p className="text-sm">
                    Choose a chat or start a new conversation
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

