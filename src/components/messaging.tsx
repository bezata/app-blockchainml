import React, { useState } from "react";
import { NavBar } from "@/components/component/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

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
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    user: { name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
    lastMessage: "Hey, how's it going?",
    timestamp: "2023-06-16T10:30:00Z",
  },
  {
    id: "2",
    user: { name: "Bob Smith", avatar: "https://i.pravatar.cc/150?img=2" },
    lastMessage: "Did you see the latest AI paper?",
    timestamp: "2023-06-16T09:45:00Z",
  },
  {
    id: "3",
    user: { name: "Charlie Brown", avatar: "https://i.pravatar.cc/150?img=3" },
    lastMessage: "Let's catch up soon!",
    timestamp: "2023-06-15T18:20:00Z",
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hey, how's it going?",
    sender: "Alice",
    timestamp: "2023-06-16T10:30:00Z",
  },
  {
    id: "2",
    content: "Not bad, just working on some AI projects. You?",
    sender: "You",
    timestamp: "2023-06-16T10:32:00Z",
  },
  {
    id: "3",
    content:
      "That sounds interesting! I'm doing some machine learning research.",
    sender: "Alice",
    timestamp: "2023-06-16T10:35:00Z",
  },
];

export default function Messaging() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: `message-${Date.now()}`,
        content: newMessage,
        sender: "You",
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                {mockConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center space-x-4 p-3 cursor-pointer hover:bg-gray-100 rounded-lg ${
                      selectedConversation?.id === conversation.id
                        ? "bg-gray-100"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <Avatar>
                      <AvatarImage
                        src={conversation.user.avatar}
                        alt={conversation.user.name}
                      />
                      <AvatarFallback>
                        {conversation.user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{conversation.user.name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(conversation.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardContent className="p-4">
              {selectedConversation ? (
                <>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={selectedConversation.user.avatar}
                        alt={selectedConversation.user.name}
                      />
                      <AvatarFallback>
                        {selectedConversation.user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">
                      {selectedConversation.user.name}
                    </h2>
                  </div>
                  <ScrollArea className="h-[calc(100vh-300px)] mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 ${
                          message.sender === "You" ? "text-right" : "text-left"
                        }`}
                      >
                        <div
                          className={`inline-block p-3 rounded-lg ${
                            message.sender === "You"
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-grow"
                    />
                    <Button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="h-[calc(100vh-200px)] flex items-center justify-center text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
