import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

type BackendResponse = {
  [key: string]: any;
};

async function fetchFromBackend(
  method: string,
  accessToken: string,
  walletAddress: string,
  body?: Record<string, any>
): Promise<BackendResponse> {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const url = `${backendUrl}/api/v1/user/profile`;

  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && Object.keys(body).length > 0) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  return await response.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.address || !session.accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let data: BackendResponse;

    switch (req.method) {
      case "GET":
        data = await fetchFromBackend(
          "GET",
          session.accessToken,
          session.address
        );
        return res.status(200).json(data);

      case "PATCH":
        data = await fetchFromBackend(
          "PATCH",
          session.accessToken,
          session.address,
          req.body
        );
        return res.status(200).json(data);

      default:
        res.setHeader("Allow", ["GET", "PATCH"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API route error:", error);
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}
