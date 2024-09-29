import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { Dataset } from "@/types/dataset";

const DATASET_FILE = path.join(process.cwd(), "data", "datasets.json");

async function fetchDatasets(): Promise<Dataset[]> {
  const huggingFaceApiKey = process.env.HUGGING_FACE_API_KEY;

  if (!huggingFaceApiKey) {
    throw new Error("Hugging Face API key is not configured");
  }

  const response = await fetch(
    "https://huggingface.co/api/datasets?&full=true&sort=downloads",
    {
      headers: {
        Authorization: `Bearer ${huggingFaceApiKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch datasets");
  }

  return await response.json();
}

function saveDatasets(datasets: Dataset[]) {
  fs.writeFileSync(DATASET_FILE, JSON.stringify(datasets, null, 2));
}

function loadDatasets(): Dataset[] {
  if (fs.existsSync(DATASET_FILE)) {
    return JSON.parse(fs.readFileSync(DATASET_FILE, "utf-8"));
  }
  return [];
}

function updateDatasets(
  oldDatasets: Dataset[],
  newDatasets: Dataset[]
): Dataset[] {
  const updatedDatasets = [...oldDatasets];

  newDatasets.forEach((newDataset) => {
    const index = updatedDatasets.findIndex((d) => d.id === newDataset.id);
    if (index !== -1) {
      // Update existing dataset
      updatedDatasets[index] = newDataset;
    } else {
      // Add new dataset
      updatedDatasets.push(newDataset);
    }
  });

  return updatedDatasets;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const newDatasets = await fetchDatasets();
    const oldDatasets = loadDatasets();
    const updatedDatasets = updateDatasets(oldDatasets, newDatasets);
    saveDatasets(updatedDatasets);

    res.status(200).json({ message: "Datasets updated successfully" });
  } catch (error) {
    console.error("Error updating datasets:", error);
    res.status(500).json({ error: "Failed to update datasets" });
  }
}
