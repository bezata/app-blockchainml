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
  initialPosts: Post[]; // Replace 'any' with your actual Post type
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
  let session = (await getSession(context)) as SIWESession | null;

  console.log(
    "Initial session check:",
    session ? "Session found" : "No session"
  );

  if (!session) {
    // If no session, try to get it from the server
    console.log("Attempting to retrieve session from server");
    session = (await getSession({ req: context.req })) as SIWESession | null;
    console.log(
      "After server retrieval:",
      session ? "Session found" : "No session"
    );
  }

  if (!session) {
    console.log("No session found, redirecting to signin");
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  console.log("Session found, user ID:", session.user.id);

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
    console.log("Successfully fetched initial posts");

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
