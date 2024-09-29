import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

const DATASET_FILE = path.join(process.cwd(), "data", "datasets.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fileContents = await fs.readFile(DATASET_FILE, "utf-8");
    const datasets = JSON.parse(fileContents);
    res.status(200).json(datasets);
  } catch (error) {
    res.status(500).json({ message: "Error reading datasets file" });
  }
}
