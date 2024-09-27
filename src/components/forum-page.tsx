"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  ThumbsUp,
  Share2,
  Plus,
  Send,
  Search,
  Calendar,
} from "lucide-react";
import { NavBar } from "@/components/component/nav-bar";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  date: string;
  likes: number;
  comments: Comment[];
  category: string;
}

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
}

export default function ForumPageComponent() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "Best practices for dataset labeling?",
      content:
        "I'm working on a large image classification project and I'm wondering what are some best practices for efficient and accurate dataset labeling. Any tips or tools you'd recommend?",
      author: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      date: "2023-06-10",
      likes: 15,
      comments: [
        {
          id: 1,
          author: "Bob Smith",
          avatar: "https://i.pravatar.cc/150?img=2",
          content:
            "Great question! I've found that using a tool like LabelBox can significantly speed up the process.",
          date: "2023-06-11",
          likes: 3,
        },
        {
          id: 2,
          author: "Charlie Brown",
          avatar: "https://i.pravatar.cc/150?img=3",
          content:
            "In my experience, the best approach is to have a clear labeling guide and to use a team of domain experts.",
          date: "2023-06-12",
          likes: 5,
        },
      ],
      category: "Data Preparation",
    },
    {
      id: 2,
      title: "Optimizing transformer models for inference",
      content:
        "I've trained a large transformer model for NLP tasks, but inference time is quite slow. What are some strategies for optimizing transformer models for faster inference without significant loss in accuracy?",
      author: "Bob Smith",
      avatar: "https://i.pravatar.cc/150?img=2",
      date: "2023-06-09",
      likes: 23,
      comments: [
        {
          id: 3,
          author: "Alice Johnson",
          avatar: "https://i.pravatar.cc/150?img=1",
          content:
            "Have you tried quantization? It can significantly reduce model size and improve inference speed.",
          date: "2023-06-10",
          likes: 7,
        },
      ],
      category: "Model Optimization",
    },
    {
      id: 3,
      title: "Handling imbalanced datasets in machine learning",
      content:
        "I'm working with a highly imbalanced dataset for a binary classification problem. What are some effective techniques to handle this imbalance and improve model performance?",
      author: "Charlie Brown",
      avatar: "https://i.pravatar.cc/150?img=3",
      date: "2023-06-08",
      likes: 18,
      comments: [],
      category: "Machine Learning",
    },
  ]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const handleNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    const post: Post = {
      id: posts.length + 1,
      ...newPost,
      author: "Current User",
      avatar: "https://i.pravatar.cc/150?img=4",
      date: new Date().toISOString().split("T")[0],
      likes: 0,
      comments: [],
      category: "General",
    };
    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "" });
    setShowNewPostForm(false);
  };

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleComment = (postId: number, newComment: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: post.comments.length + 1,
                  author: "Current User",
                  avatar: "https://i.pravatar.cc/150?img=4",
                  content: newComment,
                  date: new Date().toISOString().split("T")[0],
                  likes: 0,
                },
              ],
            }
          : post
      )
    );
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <NavBar />
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Community Forum</h1>
          <Button
            onClick={() => setShowNewPostForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-md transition-all duration-300"
            />
          </div>
        </div>

        <AnimatePresence>
          {showNewPostForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6 bg-white">
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNewPost} className="space-y-4">
                    <Input
                      placeholder="Post Title"
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      required
                    />
                    <Textarea
                      placeholder="Post Content"
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                      required
                      rows={4}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewPostForm(false)}
                      >
                        Cancel
                      </Button>
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
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-white rounded-lg p-1 shadow-sm">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md px-4 py-2 transition-colors duration-200"
            >
              All Posts
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md px-4 py-2 transition-colors duration-200"
            >
              Data Preparation
            </TabsTrigger>
            <TabsTrigger
              value="model"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md px-4 py-2 transition-colors duration-200"
            >
              Model Optimization
            </TabsTrigger>
            <TabsTrigger
              value="ml"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md px-4 py-2 transition-colors duration-200"
            >
              Machine Learning
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {filteredPosts.map((post) => (
              <ForumPost
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </TabsContent>

          {["data", "model", "ml"].map((category) => (
            <TabsContent key={category} value={category}>
              {filteredPosts
                .filter((post) =>
                  post.category.toLowerCase().includes(category)
                )
                .map((post) => (
                  <ForumPost
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                  />
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}

function ForumPost({
  post,
  onLike,
  onComment,
}: {
  post: Post;
  onLike: (postId: number) => void;
  onComment: (postId: number, comment: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    onComment(post.id, newComment);
    setNewComment("");
  };

  return (
    <Card className="mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.avatar} alt={post.author} />
            <AvatarFallback>
              {post.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">
              {post.title}
            </CardTitle>
            <p className="text-sm text-gray-500 flex items-center">
              <span>{post.author}</span>
              <span className="mx-2">•</span>
              <Calendar className="w-4 h-4 mr-1" />
              <span>{post.date}</span>
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{post.content}</p>
        <div className="flex items-center space-x-4">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 hover:bg-green-200"
          >
            {post.category}
          </Badge>
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
      </CardContent>
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="border-t pt-4">
              <h3 className="font-semibold mb-4">Comments</h3>
              <div className="space-y-4 mb-4">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.avatar} alt={comment.author} />
                      <AvatarFallback>{comment.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{comment.author}</p>
                        <p className="text-xs text-gray-500">{comment.date}</p>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        {comment.content}
                      </p>
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
                ))}
              </div>
              <form
                onSubmit={handleAddComment}
                className="flex items-center space-x-2"
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
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}