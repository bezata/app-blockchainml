// pages/api/dataset/[...id].ts

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { Dataset } from "@/types/dataset";

const DATASET_FILE = path.join(process.cwd(), "data", "datasets.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Dataset | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id } = req.query;

  if (!id || !Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid dataset ID" });
  }

  const datasetId = id.join("/");

  try {
    if (fs.existsSync(DATASET_FILE)) {
      const datasets: Dataset[] = JSON.parse(
        fs.readFileSync(DATASET_FILE, "utf-8")
      );
      const dataset = datasets.find((d) => d.id === datasetId);

      if (dataset) {
        res.status(200).json(dataset);
      } else {
        res.status(404).json({ error: "Dataset not found" });
      }
    } else {
      res.status(404).json({ error: "No datasets found" });
    }
  } catch (error) {
    console.error("Error fetching dataset:", error);
    res.status(500).json({ error: "Failed to fetch dataset" });
  }
}