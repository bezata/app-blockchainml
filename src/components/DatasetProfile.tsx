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
  Download,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";

interface Dataset {
  _id: string;
  id: string;
  author: string;
  cardData: {
    pretty_name: string;
    task_categories: string[];
    size_categories: string[];
    license: string[];
    language: string[];
    paperswithcode_id: string;
    dataset_info: {
      dataset_size: number;
      download_size: number;
      splits: Array<{
        name: string;
        num_examples: number;
      }>;
    };
  };
  lastModified: string;
  downloads: number;
  tags: string[];
  description: string;
}

interface DatasetProfileProps {
  dataset: Dataset;
  allDatasets: Dataset[];
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

const DatasetProfile: React.FC<DatasetProfileProps> = ({
  dataset,
  allDatasets,
}) => {
  const router = useRouter();
  const [selectedSplit, setSelectedSplit] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<string>("parquet");
  const [showInfo, setShowInfo] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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
      .slice(0, 5); // Limit to 5 related datasets
  }, [selectedTag, allDatasets, dataset.id]);

  const handleDownload = () => {
    let downloadUrl = "";
    if (selectedFormat === "parquet" && selectedSplit) {
      downloadUrl = `https://huggingface.co/api/datasets/${dataset.id}/parquet/default/${selectedSplit}/0.parquet`;
      window.open(downloadUrl, "_blank");
    } else if (selectedFormat === "croissant") {
      downloadUrl = `https://huggingface.co/api/datasets/${dataset.id}/croissant`;
      window.open(downloadUrl, "_blank");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <Button
        variant="outline"
        className="mb-6 border-gray-600 text-gray-300 hover:bg-gray-700"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Datasets
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          {dataset.cardData.pretty_name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Dataset Information</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>
              <strong>Author:</strong> {dataset.author}
            </p>
            <p>
              <strong>Last Modified:</strong>{" "}
              {new Date(dataset.lastModified).toLocaleString()}
            </p>
            <p>
              <strong>Downloads:</strong> {dataset.downloads}
            </p>
            <p>
              <strong>License:</strong> {dataset.cardData.license.join(", ")}
            </p>
            <p>
              <strong>Language:</strong> {dataset.cardData.language.join(", ")}
            </p>
            {dataset.cardData.paperswithcode_id && (
              <p>
                <strong>Paper:</strong>{" "}
                <a
                  href={`https://paperswithcode.com/dataset/${dataset.cardData.paperswithcode_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  View on Papers With Code{" "}
                  <ExternalLink className="inline h-4 w-4" />
                </a>
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Dataset Statistics</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>
              <strong>Total Size:</strong>{" "}
              {(
                dataset.cardData.dataset_info.dataset_size /
                1024 /
                1024
              ).toFixed(2)}{" "}
              MB
            </p>
            <p>
              <strong>Download Size:</strong>{" "}
              {(
                dataset.cardData.dataset_info.download_size /
                1024 /
                1024
              ).toFixed(2)}{" "}
              MB
            </p>
            <p>
              <strong>Number of Splits:</strong>{" "}
              {dataset.cardData.dataset_info.splits.length}
            </p>
            {dataset.cardData.dataset_info.splits.map((split) => (
              <p key={split.name}>
                <strong>{split.name}:</strong>{" "}
                {split.num_examples.toLocaleString()} examples
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Dataset Description</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300">
          <p>{dataset.description}</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700 mb-6">
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
                  {dataset.cardData.dataset_info.splits.map((split) => (
                    <SelectItem key={split.name} value={split.name}>
                      {split.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              onClick={handleDownload}
              disabled={
                (selectedFormat === "parquet" && !selectedSplit) ||
                !selectedFormat
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
          <Button
            variant="outline"
            className="text-gray-300 hover:bg-gray-700"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? (
              <ChevronUp className="mr-2 h-4 w-4" />
            ) : (
              <ChevronDown className="mr-2 h-4 w-4" />
            )}
            Download Information
          </Button>
          {showInfo && (
            <div className="mt-4 p-4 bg-gray-700 rounded-md text-gray-300">
              <h4 className="font-semibold mb-2">Download Options:</h4>
              <p>
                <strong>Parquet:</strong> Download individual splits of the
                dataset in Parquet format.
              </p>
              <p>
                <strong>Croissant:</strong> Download the entire dataset in
                Croissant format, which includes metadata and all splits.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(categorizedTags).map(([category, tags]) => (
            <div key={category} className="mb-4">
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

      {selectedTag && relatedDatasets.length > 0 && (
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Related Datasets</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-gray-300">
              {relatedDatasets.map((relatedDataset) => (
                <li key={relatedDataset.id} className="mb-2">
                  <Link
                    href={`/dataset/${relatedDataset.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    {relatedDataset.cardData.pretty_name}
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

export default DatasetProfile;
