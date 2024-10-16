import type { NextApiRequest, NextApiResponse } from "next";

type UserProfile = {
  walletAddress: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  avatar: string | null;
  chainId: string;
  language: string | null;
  theme: string | null;
  notifications: JSON | null;
  privacy: JSON | null;
  twoFactor: boolean;
  defaultPaymentAddress: string | null;
  paymentAddress: string | null;
};

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

async function fetchFromBackend(path: string, options: RequestInit) {
  const response = await fetch(`${BACKEND_URL}${path}`, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "An error occurred while fetching data");
  }
  return response.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserProfile | { error: string }>
) {
  const cookies = req.headers.cookie || "";

  try {
    if (req.method === "GET") {
      const userProfile = await fetchFromBackend("/api/v1/user/user/profile", {
        method: "GET",
        headers: {
          Cookie: cookies,
        },
        credentials: "include",
      });
      return res.status(200).json(userProfile);
    } else if (req.method === "PATCH") {
      const updatedProfile = await fetchFromBackend(
        "/api/v1/user/user/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookies,
          },
          body: JSON.stringify(req.body),
          credentials: "include",
        }
      );
      return res.status(200).json(updatedProfile);
    } else {
      res.setHeader("Allow", ["GET", "PATCH"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in user profile API route:", error);
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}
