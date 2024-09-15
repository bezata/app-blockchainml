"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ExternalLink, Code, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NavBar } from "./component/nav-bar";

interface Split {
  name: string;
  num_examples: number;
}

export interface Dataset {
  id: string;
  author: string;
  cardData: {
    pretty_name: string;
    license: string[] | string;
    language: string[] | string;
    paperswithcode_id?: string;
    dataset_info: Array<{
      config_name: string;
      splits: Split[];
      dataset_size: number;
      download_size: number;
    }>;
    configs: Array<{
      config_name: string;
    }>;
  };
  lastModified: string;
  downloads: number;
  tags: string[];
  description: string;
}

const categorizeTag = (tag: string) => {
  if (tag.startsWith("task_categories:")) return "Task";
  if (tag.startsWith("task_ids:")) return "Task ID";
  if (tag.startsWith("annotations_creators:")) return "Annotations";
  if (tag.startsWith("language_creators:")) return "Language Creator";
  if (tag.startsWith("multilinguality:")) return "Multilinguality";
  if (tag.startsWith("source_datasets:")) return "Source";
  if (tag.startsWith("language:")) return "Language";
  if (tag.startsWith("license:")) return "License";
  if (tag.startsWith("size_categories:")) return "Size";
  if (tag.startsWith("format:")) return "Format";
  if (tag.startsWith("modality:")) return "Modality";
  if (tag.startsWith("library:")) return "Library";
  if (tag.startsWith("arxiv:")) return "arXiv";
  if (tag.startsWith("region:")) return "Region";
  return "Other";
};

const DatasetProfile: React.FC<{
  dataset: Dataset;
  allDatasets: Dataset[];
}> = ({ dataset, allDatasets }) => {
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState("parquet");
  const [selectedSplit, setSelectedSplit] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const splits = useMemo(() => {
    const configInfo = dataset.cardData.dataset_info[0];
    return configInfo ? configInfo.splits : [];
  }, [dataset]);

  const categorizedTags = useMemo(() => {
    const tags: { [key: string]: string[] } = {};
    dataset.tags.forEach((tag) => {
      const category = categorizeTag(tag);
      if (!tags[category]) tags[category] = [];
      tags[category].push(tag);
    });
    return tags;
  }, [dataset.tags]);

  const relatedDatasets = useMemo(() => {
    if (!selectedTag) return [];
    return allDatasets
      .filter((d) => d.id !== dataset.id && d.tags.includes(selectedTag))
      .slice(0, 5);
  }, [selectedTag, allDatasets, dataset.id]);

  const getCodeSnippet = (format: string) => {
    switch (format) {
      case "parquet":
        return `import pandas as pd

df = pd.read_parquet("hf://datasets/${dataset.id}/${selectedSplit}-00000-of-00001.parquet")`;
      case "croissant":
        return `from mlcroissant import Dataset

ds = Dataset(jsonld="https://huggingface.co/api/datasets/${dataset.id}/croissant")
records = ds.records()`;
      default:
        return "Code snippet not available for this format.";
    }
  };

  const handleDownload = () => {
    let downloadUrl = "";
    if (selectedFormat === "parquet" && selectedSplit) {
      downloadUrl = `https://huggingface.co/datasets/${dataset.id}/resolve/main/${selectedSplit}-00000-of-00001.parquet`;
    } else if (selectedFormat === "croissant") {
      downloadUrl = `https://huggingface.co/api/datasets/${dataset.id}/croissant`;
    }
    if (downloadUrl) window.open(downloadUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-sans">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-6 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-300"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <h1 className="text-3xl font-light text-gray-800 mb-4">
          {dataset.cardData.pretty_name}
        </h1>
        <p className="text-gray-600 mb-8">by {dataset.author}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-light text-gray-700">
                Dataset Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-2">
              <InfoItem
                label="Last Modified"
                value={new Date(dataset.lastModified).toLocaleString()}
              />
              <InfoItem
                label="Downloads"
                value={dataset.downloads.toLocaleString()}
              />
              <InfoItem
                label="License"
                value={
                  Array.isArray(dataset.cardData?.license)
                    ? dataset.cardData.license.join(", ")
                    : dataset.cardData?.license || "N/A"
                }
              />
              <InfoItem
                label="Language"
                value={
                  Array.isArray(dataset.cardData?.language)
                    ? dataset.cardData.language.join(", ")
                    : dataset.cardData?.language || "N/A"
                }
              />
              {dataset.cardData?.paperswithcode_id && (
                <div>
                  <strong className="text-gray-700">Paper:</strong>{" "}
                  <a
                    href={`https://paperswithcode.com/dataset/${dataset.cardData.paperswithcode_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 hover:underline inline-flex items-center"
                  >
                    View on Papers With Code
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-light text-gray-700">
                Dataset Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Total Size:</span>
                <strong>
                  {(
                    dataset.cardData.dataset_info[0]?.dataset_size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Download Size:</span>
                <strong>
                  {(
                    dataset.cardData.dataset_info[0]?.download_size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Number of Splits:</span>
                <strong>
                  {dataset.cardData.dataset_info[0]?.splits.length}
                </strong>
              </div>
              {dataset.cardData.dataset_info[0]?.splits.map((split) => (
                <div key={split.name} className="flex justify-between">
                  <span>{split.name}:</span>
                  <strong>
                    {split.num_examples.toLocaleString()} examples
                  </strong>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-light text-gray-700">
              Dataset Description
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p>{dataset.description}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-light text-gray-700">
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(categorizedTags).map(([category, tags]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    {category}:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? "default" : "secondary"}
                        className="cursor-pointer bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-300"
                        onClick={() =>
                          setSelectedTag(selectedTag === tag ? null : tag)
                        }
                      >
                        {tag.split(":")[1]}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-light text-gray-700">
                Download Dataset
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Select
                  onValueChange={setSelectedFormat}
                  defaultValue="parquet"
                >
                  <SelectTrigger className="w-[180px] bg-white text-gray-800 border-gray-300">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parquet">Parquet</SelectItem>
                    <SelectItem value="croissant">Croissant</SelectItem>
                  </SelectContent>
                </Select>
                {selectedFormat === "parquet" && (
                  <Select onValueChange={setSelectedSplit}>
                    <SelectTrigger className="w-[180px] bg-white text-gray-800 border-gray-300">
                      <SelectValue placeholder="Select split" />
                    </SelectTrigger>
                    <SelectContent>
                      {splits?.map((split: Split) => (
                        <SelectItem key={split.name} value={split.name}>
                          {split.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              {selectedFormat && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md text-gray-800">
                  <h4 className="font-semibold mb-2">Code Snippet:</h4>
                  <pre className="bg-white p-2 rounded-md overflow-x-auto border border-gray-200">
                    <code>{getCodeSnippet(selectedFormat)}</code>
                  </pre>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          getCodeSnippet(selectedFormat)
                        );
                      }}
                    >
                      <Code className="mr-2 h-4 w-4" /> Copy Code
                    </Button>
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
                      onClick={handleDownload}
                      disabled={
                        !selectedFormat ||
                        (selectedFormat === "parquet" && !selectedSplit)
                      }
                    >
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedTag && relatedDatasets.length > 0 && (
          <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-light text-gray-700">
                Related Datasets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-gray-600">
                {relatedDatasets?.map((relatedDataset) => (
                  <li key={relatedDataset.id} className="mb-2 last:mb-0">
                    <Link
                      href={`/dataset/${relatedDataset.id}`}
                      className="text-green-600 hover:text-green-700 hover:underline"
                    >
                      {relatedDataset.cardData?.pretty_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between">
    <strong className="text-gray-700">{label}:</strong> <span>{value}</span>
  </div>
);

export default DatasetProfile;
