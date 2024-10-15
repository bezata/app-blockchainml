import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const API_BASE_URL =
  process.env.BACKEND_API_URL || "http://localhost:4000/api/v1";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getSession({ req });

  if (!session || !session.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { category } = req.query;
    const url =
      category && category !== "all"
        ? `${API_BASE_URL}/api/v1/forum/posts/category/${category}`
        : `${API_BASE_URL}/api/v1/forum/posts`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}
