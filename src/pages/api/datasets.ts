import { NextApiRequest, NextApiResponse } from "next";
import { Dataset } from "@/types/dataset";
import fs from "fs";
import path from "path";

const DATASET_FILE = path.join(process.cwd(), "data", "datasets.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Dataset[] | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    if (fs.existsSync(DATASET_FILE)) {
      const datasets: Dataset[] = JSON.parse(
        fs.readFileSync(DATASET_FILE, "utf-8")
      );
      res.status(200).json(datasets);
    } else {
      res.status(404).json({ error: "No datasets found" });
    }
  } catch (error) {
    console.error("Error fetching datasets:", error);
    res.status(500).json({ error: "Failed to fetch datasets" });
  }
}
