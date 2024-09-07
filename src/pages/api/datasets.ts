// pages/api/datasets.ts

import { NextApiRequest, NextApiResponse } from "next";
import { Dataset } from "@/types/dataset";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Dataset[] | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const huggingFaceApiKey = process.env.HUGGING_FACE_API_KEY;

  if (!huggingFaceApiKey) {
    return res
      .status(500)
      .json({ error: "Hugging Face API key is not configured" });
  }

  try {
    const response = await fetch(
      "https://huggingface.co/api/datasets?limit=500&full=true",
      {
        headers: {
          Authorization: `Bearer ${huggingFaceApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch datasets");
    }

    const data: Dataset[] = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching datasets:", error);
    res.status(500).json({ error: "Failed to fetch datasets" });
  }
}