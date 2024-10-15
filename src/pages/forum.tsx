import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import ForumPage, { SIWESession } from "../components/forum-page";

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
  return (
    <ForumPage initialPosts={initialPosts} session={session as SIWESession} />
  );
}

export const getServerSideProps: GetServerSideProps<ForumProps> = async (
  context
) => {
  const session = (await getSession(context)) as SIWESession | null;

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/forum/posts`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const initialPosts = await res.json();

    return {
      props: {
        initialPosts,
        session,
      },
    };
  } catch (error) {
    console.error("Failed to fetch initial posts:", error);
    return {
      props: {
        initialPosts: [],
        session,
      },
    };
  }
};