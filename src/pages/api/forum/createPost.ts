import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";

const API_BASE_URL =
  process.env.BACKEND_API_URL || "http://localhost:4000/api/v1";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("API Route: /api/forum/createPost - Started");
  console.log("Request method:", req.method);
  console.log("Request headers:", JSON.stringify(req.headers, null, 2));

  if (req.method !== "POST") {
    console.log("Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Retrieving session...");
  let sessionData = await getSession({ req });
  console.log("Session from getSession:", JSON.stringify(sessionData, null, 2));

  if (!sessionData) {
    console.log("No session found from getSession, trying getToken...");
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Token from getToken:", JSON.stringify(token, null, 2));

    if (token) {
      console.log("Token found, constructing session...");
      sessionData = {
        user: {
          name: token.walletAddress as string,
          email: token.apiKey as string,
        },
        expires: new Date((token.exp as number) * 1000).toISOString(),
        accessToken: token.accessToken as string,
        address: token.walletAddress as string,
        chainId: token.chainId as string,
      };
      console.log("Constructed session:", JSON.stringify(sessionData, null, 2));
    }
  }

  if (!sessionData || !sessionData.accessToken) {
    console.log("No valid session or access token found");
    return res.status(401).json({ error: "Unauthorized - No valid session" });
  }

  try {
    const { title, content, category } = req.body;
    console.log("Request body:", { title, content, category });

    const backendUrl = `${API_BASE_URL}/api/v1/forum/posts`;
    console.log("Backend URL:", backendUrl);

    console.log("Sending request to backend...");
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.accessToken}`,
      },
      body: JSON.stringify({ title, content, category }),
    });

    console.log("Backend response status:", response.status);
    console.log(
      "Backend response headers:",
      JSON.stringify(response.headers, null, 2)
    );

    let data;
    const responseText = await response.text();
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", responseText);
      data = { error: "Invalid JSON response from server" };
    }
    console.log("Backend response data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error(
        "Backend returned an error:",
        data.error || response.statusText
      );
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    console.log("Successfully created post. Sending response to client.");
    res.status(201).json(data);
  } catch (error) {
    console.error("Error in createPost handler:", error);
    console.error("Error stack:", (error as Error).stack);
    res
      .status(500)
      .json({
        error: "Failed to create post",
        details: (error as Error).message,
      });
  } finally {
    console.log("API Route: /api/forum/createPost - Finished");
  }
}
