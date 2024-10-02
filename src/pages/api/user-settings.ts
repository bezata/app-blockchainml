// pages/api/user-settings.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await fetch(`http://localhost:4000/api/v1/user-settings`, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.id}`,
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Backend error: ${JSON.stringify(data)}`);
      return res
        .status(response.status)
        .json({ error: data.error || "An error occurred" });
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error proxying request to backend:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
