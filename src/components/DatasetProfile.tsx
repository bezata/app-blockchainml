import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import { Dataset } from "@/types/dataset";

interface DatasetProfileProps {
  dataset: Dataset;
}

const DatasetProfile: React.FC<DatasetProfileProps> = ({ dataset }) => {
  const router = useRouter();

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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="mr-2 h-4 w-4" /> Download Dataset
        </Button>
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

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {dataset.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gray-700 text-gray-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatasetProfile;
