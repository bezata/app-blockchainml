import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/user-settings/renew-api-key`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
          Cookie: req.headers.cookie || "",
        },
        credentials: "include",
        body: JSON.stringify({ action: "renew-api-key" }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend error:", data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error communicating with backend:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
