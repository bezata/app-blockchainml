// pages/api/user/settings.ts
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
    return res.status(401).json({ error: "Authentication required" });
  }

  const { method } = req;
  const cookies = req.headers.cookie || "";

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        Cookie: cookies,
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include",
    };

    if (method && ["PUT", "PATCH"].includes(method)) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    console.log(
      `Sending ${method} request to ${BACKEND_URL}/api/v1/user-settings/`
    );
    console.log("Request body:", fetchOptions.body);

    const response = await fetch(
      `${BACKEND_URL}/api/v1/user-settings/`,
      fetchOptions
    );

    const data = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Forward any set-cookie headers from the backend
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error communicating with backend:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}