"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Star } from "lucide-react";

interface Dataset {
  _id: string;
  id: string;
  cardData: {
    pretty_name: string;
    task_categories: string[];
    size_categories: string[];
  };
  lastModified: string;
  downloads: number;
  tags: string[];
  isPremium: boolean;
  provider: "HuggingFace" | "BlockchainML";
}

interface DatasetCardProps {
  dataset: Dataset;
}

const getTagDisplayText = (tag: string) => {
  const parts = tag.split(":");
  return parts.length > 1 ? parts[1] : tag;
};

export default function DatasetCardComponent({ dataset }: DatasetCardProps) {
  const router = useRouter();

  return (
    <Card className="bg-white border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-700 line-clamp-2 flex-grow">
            {dataset.cardData?.pretty_name || "Unnamed Dataset"}
          </h3>
          <div className="flex items-center mt-1 space-x-2 ml-2">
            <Image
              src={
                dataset.provider === "BlockchainML"
                  ? "/angry.png"
                  : "/hflogo.png"
              }
              alt={`${dataset.provider} logo`}
              width={24}
              height={24}
            />
            {dataset.isPremium && (
              <Badge
                variant="default"
                className="bg-yellow-100 text-yellow-800 flex items-center"
              >
                <Star className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4 flex-grow">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Size:</span>
            <span className="text-gray-700">
              {dataset.cardData?.size_categories?.[0] || "Unknown"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Downloads:</span>
            <span className="text-gray-700">{dataset.downloads ?? "N/A"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Last Updated:</span>
            <span className="text-gray-700">
              {new Date(dataset.lastModified).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[2.5rem]">
          {dataset.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-600"
            >
              {getTagDisplayText(tag)}
            </Badge>
          ))}
          {dataset.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-600"
            >
              +{dataset.tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex justify-between mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 transition-colors duration-300"
          >
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-300"
            onClick={() => router.push(`/dataset/${dataset.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" /> View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
