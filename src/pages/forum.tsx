"use client";

import { BlockedUsersModal } from "@/components/blockedUserModal";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
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
  TrendingUp,
  Home,
  User,
  UserRoundX,
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

interface Author {
  id: string;
  name: string;
  username: string;
  avatar: string;
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

const mockAuthors: Author[] = [
  {
    id: "a1",
    name: "Tech Innovator",
    username: "techinnovator",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "a2",
    name: "AI Enthusiast",
    username: "aienthusiast",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "a3",
    name: "Curious Dev",
    username: "curiousdev",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "a4",
    name: "AI Startup",
    username: "aistartup",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "a5",
    name: "AI Researcher",
    username: "airesearcher",
    avatar: "https://i.pravatar.cc/150?img=5",
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
  const [showBlockedUsersModal, setShowBlockedUsersModal] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([
    {
      id: "b1",
      name: "Blocked User 1",
      username: "blockeduser1",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    {
      id: "b2",
      name: "Blocked User 2",
      username: "blockeduser2",
      avatar: "https://i.pravatar.cc/150?img=7",
    },
  ]);

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

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleUnblockUser = (userId: string) => {
    setBlockedUsers(blockedUsers.filter((user) => user.id !== userId));
  };

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
                <nav className="">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setShowProfileDialog(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Link href="/messages" passHref>
                    <Button variant="ghost" className="w-full justify-start">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Messages
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start   hover:bg-red-50"
                    onClick={() => setShowBlockedUsersModal(true)}
                  >
                    <UserRoundX className=" text-red-600 mr-2 h-4 w-4" />
                    Blocked Users
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
              <TabsList className="bg-white rounded-lg p-1 shadow-sm border  text-gray-600 border-gray-200">
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
            <Card className="sticky top-20">
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
      <BlockedUsersModal
        isOpen={showBlockedUsersModal}
        onClose={() => setShowBlockedUsersModal(false)}
        blockedUsers={blockedUsers}
        onUnblock={handleUnblockUser}
      />
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
                <Calendar className="w-4 h-4 mb-1 inline mr-1" />
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
