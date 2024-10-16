"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NavBar } from "@/components/component/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  ThumbsUp,
  Share2,
  Send,
  Search,
  Calendar,
  Hash,
  TrendingUp,
  Home,
  User,
  Settings,
  LogOut,
  X,
  MoreHorizontal,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface Author {
  id: string;
  name: string;
  username: string;
  avatar: string;
  lastSeen: string;
  isActive: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  likes: number;
}

interface Post {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  likes: number;
  comments: Comment[];
  tags: string[];
}

interface Message {
  id: string;
  content: string;
  sender: Author;
  receiver: Author;
  createdAt: string;
}

const mockAuthors: Author[] = [
  {
    id: "a1",
    name: "Tech Innovator",
    username: "techinnovator",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastSeen: "2023-06-16T11:30:00Z",
    isActive: true,
  },
  {
    id: "a2",
    name: "AI Enthusiast",
    username: "aienthusiast",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastSeen: "2023-06-16T10:45:00Z",
    isActive: false,
  },
  {
    id: "a3",
    name: "Curious Dev",
    username: "curiousdev",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastSeen: "2023-06-16T09:15:00Z",
    isActive: true,
  },
  {
    id: "a4",
    name: "AI Startup",
    username: "aistartup",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastSeen: "2023-06-15T22:30:00Z",
    isActive: false,
  },
  {
    id: "a5",
    name: "AI Researcher",
    username: "airesearcher",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastSeen: "2023-06-16T08:00:00Z",
    isActive: true,
  },
];

const mockPosts: Post[] = [
  {
    id: "1",
    content:
      "Just launched our new AI model! It can now generate images from text descriptions. #AIInnovation #MachineLearning",
    author: mockAuthors[0],
    createdAt: "2023-06-15T10:30:00Z",
    likes: 1520,
    comments: [
      {
        id: "c1",
        content: "This is amazing! Can't wait to try it out.",
        author: mockAuthors[1],
        createdAt: "2023-06-15T11:00:00Z",
        likes: 45,
      },
      {
        id: "c2",
        content: "How does it compare to DALL-E?",
        author: mockAuthors[2],
        createdAt: "2023-06-15T11:15:00Z",
        likes: 32,
      },
    ],
    tags: ["AIInnovation", "MachineLearning"],
  },
  {
    id: "2",
    content:
      "Excited to announce our partnership with @TechGiant! Together, we'll be working on cutting-edge NLP projects. #NLP #AICollaboration",
    author: mockAuthors[3],
    createdAt: "2023-06-14T14:45:00Z",
    likes: 2103,
    comments: [
      {
        id: "c3",
        content: "Congratulations! This is huge news for the AI community.",
        author: mockAuthors[4],
        createdAt: "2023-06-14T15:00:00Z",
        likes: 78,
      },
    ],
    tags: ["NLP", "AICollaboration"],
  },
];

const mockMessages: Message[] = [
  {
    id: "m1",
    content: "Hey, how's the new AI project coming along?",
    sender: mockAuthors[1],
    receiver: mockAuthors[0],
    createdAt: "2023-06-16T09:30:00Z",
  },
  {
    id: "m2",
    content:
      "It's going great! We're making significant progress on the image generation capabilities.",
    sender: mockAuthors[0],
    receiver: mockAuthors[1],
    createdAt: "2023-06-16T09:35:00Z",
  },
  {
    id: "m3",
    content: "That sounds exciting! Can't wait to see the results.",
    sender: mockAuthors[1],
    receiver: mockAuthors[0],
    createdAt: "2023-06-16T09:40:00Z",
  },
];

const trendingTags = [
  "AIInnovation",
  "MachineLearning",
  "NLP",
  "DataScience",
  "DeepLearning",
  "ComputerVision",
  "BigData",
  "Python",
  "TensorFlow",
  "Robotics",
];

export default function SocialFeed() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [activeTab, setActiveTab] = useState("home");
  const [newPost, setNewPost] = useState({ content: "", tags: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activeConversation, setActiveConversation] = useState<Author | null>(
    null
  );

  const handleNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    const newPostObj: Post = {
      id: `post-${Date.now()}`,
      content: newPost.content,
      author: mockAuthors[0], // Assuming the current user is the first mock author
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      tags: newPost.content.match(/#\w+/g)?.map((tag) => tag.slice(1)) || [],
    };

    setPosts([newPostObj, ...posts]);
    setNewPost({ content: "", tags: [] });
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleComment = (postId: string, commentContent: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: `comment-${Date.now()}`,
            content: commentContent,
            author: mockAuthors[0], // Assuming the current user is the first mock author
            createdAt: new Date().toISOString(),
            likes: 0,
          };
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const newMessageObj: Message = {
      id: `message-${Date.now()}`,
      content: newMessage,
      sender: mockAuthors[0], // Assuming the current user is the first mock author
      receiver: activeConversation,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, newMessageObj]);
    setNewMessage("");
  };

  const getLastMessage = (author: Author) => {
    const conversationMessages = messages.filter(
      (m) =>
        (m.sender.id === author.id && m.receiver.id === mockAuthors[0].id) ||
        (m.sender.id === mockAuthors[0].id && m.receiver.id === author.id)
    );
    return conversationMessages[conversationMessages.length - 1];
  };

  const recentConversations = mockAuthors.slice(1).map((author) => ({
    ...author,
    lastMessage: getLastMessage(author),
  }));

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={mockAuthors[0].avatar}
                      alt={mockAuthors[0].name}
                    />
                    <AvatarFallback>{mockAuthors[0].name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{mockAuthors[0].name}</p>
                    <p className="text-sm text-gray-500">
                      @{mockAuthors[0].username}
                    </p>
                  </div>
                </div>
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setActiveTab("home")}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setShowProfileDialog(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setShowMessaging(true)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Messages
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-4">
                <form onSubmit={handleNewPost}>
                  <Textarea
                    placeholder="What's happening in AI?"
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                    className="mb-2"
                    rows={3}
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Use # to add tags
                    </div>
                    <Button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Post
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="bg-white rounded-lg p-1 shadow-sm border hover:text-white text-gray-600 border-gray-200">
                <TabsTrigger value="home">For You</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="latest">Latest</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="space-y-6">
                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-20 h-60
            ">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-yellow-500" />
                  Trending Tags
                </h2>
                <ScrollArea className="h-64">
                  <div className="flex flex-wrap gap-2">
                    {trendingTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={mockAuthors[0].avatar}
                  alt={mockAuthors[0].name}
                />
                <AvatarFallback>{mockAuthors[0].name[0]}</AvatarFallback>
              </Avatar>
              <Button>Change Avatar</Button>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={mockAuthors[0].name}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={mockAuthors[0].username}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Popover open={showMessaging} onOpenChange={setShowMessaging}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="fixed bottom-4 right-4 bg-green-500 text-white hover:bg-green-600"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 h-[600px] p-0">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Messages</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMessaging(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Tabs
                defaultValue="conversations"
                className="h-full flex flex-col"
              >
                <TabsList className="justify-start px-4 py-2">
                  <TabsTrigger value="conversations">Conversations</TabsTrigger>
                  <TabsTrigger value="online">Online</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="conversations"
                  className="flex-1 overflow-auto"
                >
                  {recentConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex items-center space-x-4 p-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <Avatar className="h-12 w-12 relative">
                        <AvatarImage
                          src={conversation.avatar}
                          alt={conversation.name}
                        />
                        <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                        {conversation.isActive && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {conversation.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage?.content ||
                            "No messages yet"}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {conversation.lastMessage
                          ? format(
                              new Date(conversation.lastMessage.createdAt),
                              "HH:mm"
                            )
                          : format(new Date(conversation.lastSeen), "dd/MM")}
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="online" className="flex-1 overflow-auto">
                  {mockAuthors
                    .filter((author) => author.isActive)
                    .map((author) => (
                      <div
                        key={author.id}
                        className="flex items-center space-x-4 p-4 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setActiveConversation(author)}
                      >
                        <Avatar className="h-12 w-12 relative">
                          <AvatarImage src={author.avatar} alt={author.name} />
                          <AvatarFallback>{author.name[0]}</AvatarFallback>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{author.name}</p>
                          <p className="text-sm text-gray-500">
                            @{author.username}
                          </p>
                        </div>
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </div>
            {activeConversation && (
              <div className="border-t p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={activeConversation.avatar}
                        alt={activeConversation.name}
                      />
                      <AvatarFallback>
                        {activeConversation.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">
                      {activeConversation.name}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="h-64 mb-4">
                  {messages
                    .filter(
                      (m) =>
                        (m.sender.id === activeConversation.id &&
                          m.receiver.id === mockAuthors[0].id) ||
                        (m.sender.id === mockAuthors[0].id &&
                          m.receiver.id === activeConversation.id)
                    )
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`mb-2 ${
                          message.sender.id === mockAuthors[0].id
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        <div
                          className={`inline-block p-2 rounded-lg ${
                            message.sender.id === mockAuthors[0].id
                              ? "bg-green-500 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(message.createdAt), "HH:mm")}
                          </p>
                        </div>
                      </div>
                    ))}
                </ScrollArea>
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center"
                >
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow mr-2"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-green-500 text-white hover:bg-green-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function PostCard({
  post,
  onLike,
  onComment,
}: {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment("");
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-sm  text-gray-500">
                  @{post.author.username}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                <Calendar className="w-4 h-4 inline mr-1" />
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="mt-2 text-gray-700">{post.content}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-green-600"
                onClick={() => onLike(post.id)}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                {post.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-green-600"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {post.comments.length}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-green-600"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardFooter className="border-t pt-4 flex flex-col items-start">
              <div className="space-y-4 mb-4 w-full">
                {post.comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
              <form
                onSubmit={handleAddComment}
                className="flex items-center space-x-2 w-full"
              >
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                  disabled={!newComment.trim()}
                >
                  <Send className="w-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg">
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{comment.author.name}</p>
          <p className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </div>
        <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-green-600 mt-1"
        >
          <ThumbsUp className="w-3 h-3 mr-1" />
          {comment.likes}
        </Button>
      </div>
    </div>
  );
}
