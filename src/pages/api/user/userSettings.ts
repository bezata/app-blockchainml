import type { NextApiRequest, NextApiResponse } from "next";

type UserSettings = {
  name?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  chainId?: number;
  language?: string;
  theme?: string;
  notifications?: boolean;
  privacy?: JSON;
  twoFactor?: boolean;
  defaultPaymentAddress?: string;
  paymentAddress?: string;
};

async function updateUserSettings(
  settings: UserSettings,
  cookies: string
): Promise<UserSettings> {
  const response = await fetch("http://localhost:4000/api/v1/user-settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies,
    },
    body: JSON.stringify(settings),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update user settings");
  }

  return response.json();
}

async function fetchUserSettings(cookies: string): Promise<UserSettings> {
  const response = await fetch("http://localhost:4000/api/v1/user-settings", {
    method: "GET",
    headers: {
      Cookie: cookies,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch user settings");
  }
  return response.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserSettings | { error: string }>
) {
  // Forward the cookies from the client request to the backend
  const cookies = req.headers.cookie || "";

  try {
    if (req.method === "GET") {
      const settings = await fetchUserSettings(cookies);
      res.status(200).json(settings);
    } else if (req.method === "PUT") {
      const updatedSettings = await updateUserSettings(req.body, cookies);
      res.status(200).json(updatedSettings);
    } else {
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error handling user settings:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
}
