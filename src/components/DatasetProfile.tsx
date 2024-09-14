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
import {
  ArrowLeft,
  ExternalLink,
  Code,
  ChevronDown,
  Download,
} from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";

interface Split {
  name: string;
  num_examples: number;
}

interface Dataset {
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
  const [selectedConfig, setSelectedConfig] = useState("");
  const [selectedSplit, setSelectedSplit] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const configs = useMemo(() => dataset.cardData?.configs || [], [dataset]);

  const availableFormats = useMemo(() => {
    const formats = [];
    if (dataset.tags.includes("format:parquet")) formats.push("parquet");
    if (dataset.tags.includes("format:csv")) formats.push("csv");
    if (dataset.tags.includes("library:mlcroissant")) formats.push("croissant");
    if (dataset.tags.includes("library:datasets")) formats.push("datasets");
    if (dataset.tags.includes("library:pandas")) formats.push("pandas");
    if (dataset.tags.includes("library:polars")) formats.push("polars");
    return formats;
  }, [dataset]);

  const splits = useMemo(() => {
    if (!selectedConfig) return [];
    const configInfo = dataset.cardData.dataset_info.find(
      (info) => info.config_name === selectedConfig
    );
    return configInfo ? configInfo.splits : [];
  }, [dataset, selectedConfig]);

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
      case "csv":
        return `import pandas as pd

splits = {'train': '${selectedConfig}/train-00000-of-00001.${format}'}
df = pd.read_${format}("hf://datasets/${dataset.id}/" + splits["${selectedSplit}"])`;
      case "croissant":
        return `from mlcroissant import Dataset

ds = Dataset(jsonld="https://huggingface.co/api/datasets/${dataset.id}/croissant")
records = ds.records("${selectedConfig}")`;
      case "datasets":
        return `from datasets import load_dataset

ds = load_dataset("${dataset.id}", "${selectedConfig}")`;
      case "pandas":
        return `import pandas as pd

splits = {'train': '${selectedConfig}/train-00000-of-00001.parquet'}
df = pd.read_parquet("hf://datasets/${dataset.id}/" + splits["${selectedSplit}"])`;
      case "polars":
        return `import polars as pl

splits = {'train': '${selectedConfig}/train-00000-of-00001.parquet'}
df = pl.read_parquet('hf://datasets/${dataset.id}/' + splits['${selectedSplit}'])`;
      default:
        return "Code snippet not available for this format.";
    }
  };

  const handleDownload = () => {
    let downloadUrl = "";
    if (
      (selectedFormat === "parquet" || selectedFormat === "csv") &&
      selectedConfig &&
      selectedSplit
    ) {
      downloadUrl = `https://huggingface.co/datasets/${dataset.id}/resolve/main/${selectedConfig}/${selectedSplit}-00000-of-00001.${selectedFormat}`;
      window.open(downloadUrl, "_blank");
    } else if (selectedFormat === "croissant") {
      downloadUrl = `https://huggingface.co/api/datasets/${dataset.id}/croissant`;
      window.open(downloadUrl, "_blank");
    }
  };

  return (
    <div className="p-6 bg-gray-300 min-h-screen">
      <Button
        variant="outline"
        className="mb-6 border-gray-600 night text-black hover:bg-gray-700"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">
          {dataset.cardData.pretty_name}
        </h1>
        <p className="text-gray-400">by {dataset.author}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="night border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Dataset Information</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-2">
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
                <strong className="text-gray-400">Paper:</strong>{" "}
                <a
                  href={`https://paperswithcode.com/dataset/${dataset.cardData.paperswithcode_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline inline-flex items-center"
                >
                  View on Papers With Code
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="night border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Dataset Statistics</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 ">
            <div className="flex gap-2">
              <p className="">Total Size:</p>
              <strong className="bold">
                {(
                  dataset.cardData.dataset_info.dataset_size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </strong>
            </div>
            <div className="flex gap-2">
              <p>Download Size:</p>
              <strong>
                {(
                  dataset.cardData.dataset_info.download_size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </strong>
            </div>
            <div className="flex gap-2">
              <p>Number of Splits:</p>
              <strong>{dataset.cardData.dataset_info.splits.length}</strong>
            </div>
            {dataset.cardData.dataset_info.splits.map((split) => (
              <p key={split.name}>
                {split.name}:{" "}
                <strong>{split.num_examples.toLocaleString()}</strong> examples
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="night border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Dataset Description</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300">
          <p>{dataset.description}</p>
        </CardContent>
      </Card>
      <div className="flex flex-row">
        <Card className="night border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(categorizedTags).map(([category, tags]) => (
              <div
                key={category}
                className="mb-4 grid grid-cols-7 gap-2 md:grid-cols-2"
              >
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  {category}:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "secondary"}
                      className="cursor-pointer"
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

        <Card className="night border-gray-700 mb-6 w-full">
          <CardHeader>
            <CardTitle className="text-white">Download Dataset</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Select onValueChange={setSelectedFormat} defaultValue="parquet">
                <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parquet">Parquet</SelectItem>
                  <SelectItem value="croissant">Croissant</SelectItem>
                </SelectContent>
              </Select>
              {selectedFormat === "parquet" && (
                <Select onValueChange={setSelectedSplit}>
                  <SelectTrigger className="w-[180px] bg-gray-700 text-white">
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
              </>
            )}
          </div>
          {selectedFormat && (
            <div className="mt-4 p-4 bg-gray-700 rounded-md text-gray-300">
              <h4 className="font-semibold mb-2">Code Snippet:</h4>
              <pre className="bg-gray-800 p-2 rounded-md overflow-x-auto">
                <code>{getCodeSnippet(selectedFormat)}</code>
              </pre>
              <div className="flex space-x-2 mt-2">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      getCodeSnippet(selectedFormat)
                    );
                  }}
                >
                  <Code className="mr-2 h-4 w-4" /> Copy Code
                </Button>
                {(selectedFormat === "parquet" ||
                  selectedFormat === "csv" ||
                  selectedFormat === "croissant") && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleDownload}
                    disabled={
                      !selectedFormat ||
                      (selectedFormat !== "croissant" &&
                        (!selectedConfig || !selectedSplit))
                    }
                  >
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(categorizedTags)?.map(([category, tags]) => (
            <div key={category} className="mb-4 last:mb-0">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                {category}:
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags?.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "secondary"}
                    className="cursor-pointer"
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

      {selectedTag && relatedDatasets.length > 0 && (
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Related Datasets</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-gray-300">
              {relatedDatasets?.map((relatedDataset) => (
                <li key={relatedDataset.id} className="mb-2 last:mb-0">
                  <Link
                    href={`/dataset/${relatedDataset.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    {relatedDataset.cardData?.pretty_name}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div>
    <strong className="text-gray-400">{label}:</strong> {value}
  </div>
);

export default DatasetProfile;