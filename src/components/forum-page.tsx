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
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ThumbsUp, Share2, Plus, Send } from "lucide-react";
import { NavBar } from "@/components/component/nav-bar";

export default function ForumPageComponent() {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Best practices for dataset labeling?",
      content:
        "I'm working on a large image classification project and I'm wondering what are some best practices for efficient and accurate dataset labeling. Any tips or tools you'd recommend?",
      author: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      date: "2023-06-10",
      likes: 15,
      comments: 7,
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
      comments: 12,
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
      comments: 9,
      category: "Machine Learning",
    },
  ]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const handleNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    const post = {
      id: posts.length + 1,
      ...newPost,
      author: "Current User",
      avatar: "https://i.pravatar.cc/150?img=4",
      date: new Date().toISOString().split("T")[0],
      likes: 0,
      comments: 0,
      category: "General",
    };
    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "" });
    setShowNewPostForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Community Forum</h1>
        <Button onClick={() => setShowNewPostForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <AnimatePresence>
        {showNewPostForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
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
                    <Button type="submit">Post</Button>
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
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="data">Data Preparation</TabsTrigger>
          <TabsTrigger value="model">Model Optimization</TabsTrigger>
          <TabsTrigger value="ml">Machine Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {posts.map((post) => (
            <ForumPost key={post.id} post={post} />
          ))}
        </TabsContent>

        {["data", "model", "ml"].map((category) => (
          <TabsContent key={category} value={category}>
            {posts
              .filter((post) => post.category.toLowerCase().includes(category))
              .map((post) => (
                <ForumPost key={post.id} post={post} />
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  date: string;
  likes: number;
  comments: number;
  category: string;
}

function ForumPost({ post }: { post: Post }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the comment to your backend
    console.log("New comment:", newComment);
    setNewComment("");
  };

  return (
    <>
      <NavBar />
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.avatar} alt={post.author} />
              <AvatarFallback>
                {post.author
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{post.title}</CardTitle>
              <p className="text-sm text-gray-500">
                Posted by {post.author} on {post.date}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{post.content}</p>
          <div className="mt-4 flex items-center space-x-4">
            <Badge>{post.category}</Badge>
            <span className="text-sm text-gray-500 flex items-center">
              <ThumbsUp className="w-4 h-4 mr-1" /> {post.likes}
            </span>
            <span className="text-sm text-gray-500 flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" /> {post.comments}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {showComments ? "Hide" : "Show"} Comments
          </Button>
          <Button variant="ghost">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </CardFooter>
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="border-t pt-4">
                <h3 className="font-semibold mb-2">Comments</h3>
                <div className="space-y-4 mb-4">
                  {/* Placeholder comments */}
                  <div className="flex items-start space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src="https://i.pravatar.cc/150?img=5"
                        alt="Commenter"
                      />
                      <AvatarFallback>C1</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Commenter 1</p>
                      <p className="text-sm text-gray-600">
                        Great question! I&apos;ve found that...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src="https://i.pravatar.cc/150?img=6"
                        alt="Commenter"
                      />
                      <AvatarFallback>C2</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Commenter 2</p>
                      <p className="text-sm text-gray-600">
                        In my experience, the best approach is...
                      </p>
                    </div>
                  </div>
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
                  <Button type="submit" size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </>
  );
}
