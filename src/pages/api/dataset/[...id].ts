// pages/api/dataset/[...id].ts

import { NextApiRequest, NextApiResponse } from "next";
import { Dataset } from "@/types/dataset";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Dataset | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id } = req.query;
  const huggingFaceApiKey = process.env.HUGGING_FACE_API_KEY;

  if (!huggingFaceApiKey) {
    return res
      .status(500)
      .json({ error: "Hugging Face API key is not configured" });
  }

  if (!id || !Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid dataset ID" });
  }

  const datasetId = id.join("/");

  try {
    const response = await fetch(
      `https://huggingface.co/api/datasets/${datasetId}`,
      {
        headers: {
          Authorization: `Bearer ${huggingFaceApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch dataset");
    }

    const data: Dataset = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching dataset:", error);
    res.status(500).json({ error: "Failed to fetch dataset" });
  }
}
