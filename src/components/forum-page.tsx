import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { Session } from "next-auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";
const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000/api/v1/forum/live";

interface Author {
  id: string;
  name: string;
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
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  likes: number;
  comments: Comment[];
  category: string;
}

export interface SIWESession extends Session {
  user: {
    id: string;
    ethAddress: string;
    apiKey: string;
  };
  accessToken: string;
}

interface ForumPageProps {
  initialPosts: Post[];
  session: SIWESession;
}

export default function ForumPage({
  initialPosts,
  session: initialSession,
}: ForumPageProps) {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const [session, setSession] = useState<SIWESession | null>(initialSession);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "General",
  });
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (sessionData) {
      setSession(sessionData as SIWESession);
    }
  }, [sessionData]);

  useEffect(() => {
    console.log("ForumPage - Session status:", status);
    console.log("ForumPage - Session data:", session);
    console.log("ForumPage - Initial Session data:", initialSession);
  }, [session, status, initialSession]);

  const fetchPosts = useCallback(
    async (category?: string) => {
      if (!session?.accessToken) return;
      setIsLoading(true);
      setError(null);
      try {
        const url =
          category && category !== "all"
            ? `${API_BASE_URL}/forum/posts/category/${category}`
            : `${API_BASE_URL}/forum/posts`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError("Failed to fetch posts. Please try again later.");
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [session]
  );

  useEffect(() => {
    if (session?.accessToken) {
      fetchPosts();
      if (!ws) {
        const newWs = new WebSocket(WS_URL);
        setWs(newWs);

        return () => {
          newWs.close();
        };
      }
    }
  }, [session, fetchPosts, ws]);

  const handleNewPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;
    setError(null);

    if (!newPost.title || !newPost.content) {
      setError("Please provide both title and content for the post.");
      return;
    }

    try {
      const payload = {
        ...newPost,
        userId: session.user.id,
      };
      console.log("Request payload:", payload);

      const response = await fetch(`${API_BASE_URL}/forum/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const createdPost = await response.json();
      setPosts((prevPosts) => [createdPost, ...prevPosts]);
      setNewPost({
        title: "",
        content: "",
        category: "General",
      });
      setShowNewPostForm(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(`Failed to create post: ${errorMessage}`);
      console.error("Error creating post:", error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!session?.accessToken) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/forum/posts/${postId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to like post");
      }
      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: updatedPost.likes } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
      setError(
        `Failed to like post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleComment = async (postId: string, newComment: string) => {
    if (!session?.accessToken) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/forum/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add comment");
      }
      // The WebSocket will handle updating the posts state
    } catch (error) {
      console.error("Error adding comment:", error);
      setError(
        `Failed to add comment: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };
  const filteredPosts = useMemo(() => {
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session && status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <NavBar />

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

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AnimatePresence>
          {showNewPostForm && (
            <NewPostForm
              newPost={newPost}
              setNewPost={setNewPost}
              handleNewPost={handleNewPost}
              setShowNewPostForm={setShowNewPostForm}
            />
          )}
        </AnimatePresence>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-white rounded-lg p-1 shadow-sm">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="data">Data Preparation</TabsTrigger>
            <TabsTrigger value="model">Model Optimization</TabsTrigger>
            <TabsTrigger value="ml">Machine Learning</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : (
            <>
              <TabsContent value="all">
                <PostList
                  posts={filteredPosts}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              </TabsContent>
              {["data", "model", "ml"].map((category) => (
                <TabsContent key={category} value={category}>
                  <PostList
                    posts={(filteredPosts ?? []).filter(
                      (post) => post.category.toLowerCase() === category
                    )}
                    onLike={handleLike}
                    onComment={handleComment}
                  />
                </TabsContent>
              ))}
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
}

function NewPostForm({
  newPost,
  setNewPost,
  handleNewPost,
  setShowNewPostForm,
}: {
  newPost: { title: string; content: string; category: string };
  setNewPost: React.Dispatch<
    React.SetStateAction<{ title: string; content: string; category: string }>
  >;
  handleNewPost: (e: React.FormEvent) => void;
  setShowNewPostForm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
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
            <select
              value={newPost.category}
              onChange={(e) =>
                setNewPost({ ...newPost, category: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="General">General</option>
              <option value="Data Preparation">Data Preparation</option>
              <option value="Model Optimization">Model Optimization</option>
              <option value="Machine Learning">Machine Learning</option>
            </select>
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
  );
}

function PostList({
  posts,
  onLike,
  onComment,
}: {
  posts: Post[];
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
}) {
  return (
    <div className="space-y-6">
      {posts?.map((post: Post) => (
        <ForumPost
          key={post.id}
          post={post}
          onLike={onLike}
          onComment={onComment}
        />
      ))}
    </div>
  );
}

function ForumPost({
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
    onComment(post.id, newComment);
    setNewComment("");
  };

  return (
    <Card className="mb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">
              {post.title}
            </CardTitle>
            <p className="text-sm text-gray-500 flex items-center">
              <span>{post.author.name}</span>
              <span className="mx-2">•</span>
              <Calendar className="w-4 h-4 mr-1" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
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
                  <CommentItem key={comment.id} comment={comment} />
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
                  disabled={!newComment.trim()}
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
