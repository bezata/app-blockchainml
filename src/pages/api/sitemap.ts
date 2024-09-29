// pages/api/sitemap.ts

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { Dataset } from "@/types/dataset";

const DATASET_FILE = path.join(process.cwd(), "data", "datasets.json");

function generateSiteMap(datasets: Dataset[]): string {
  const baseUrl = "https://localhost:3000"; // Replace with your actual domain

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Home Page -->
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <!-- Datasets List Page -->
      <url>
        <loc>${baseUrl}/datasets</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
      <!-- Individual Dataset Pages -->
      ${datasets
        .map((dataset) => {
          return `
        <url>
          <loc>${baseUrl}/dataset/${dataset.id}</loc>
          <lastmod>${new Date(dataset.lastModified).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>`;
        })
        .join("")}
    </urlset>`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Read datasets from the JSON file
      const fileContents = fs.readFileSync(DATASET_FILE, "utf-8");
      const datasets: Dataset[] = JSON.parse(fileContents);

      // Generate the sitemap
      const sitemap = generateSiteMap(datasets);

      // Set the appropriate headers
      res.setHeader("Content-Type", "application/xml");
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=1200, stale-while-revalidate=600"
      );

      // Send the sitemap
      res.status(200).send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).json({ error: "Failed to generate sitemap" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
