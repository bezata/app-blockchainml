
import SocialFeed from "../components/forum-page";
import { SIWESession } from "@reown/appkit-siwe";

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

interface ForumProps {
  initialPosts: Post[];
  session: SIWESession | null;
}

export default function Forum({ initialPosts, session }: ForumProps) {
  return <SocialFeed />;
}


