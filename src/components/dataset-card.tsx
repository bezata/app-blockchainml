"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Eye,
  Star,
  Calendar,
  ArrowDownToLine,
  Users,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <CardContent className="p-4 sm:p-6 flex flex-row h-full">
        <div className="flex-grow pr-4 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-gray-800 line-clamp-2 flex-grow mr-2">
              {dataset.cardData?.pretty_name || "Unnamed Dataset"}
            </h3>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <Image
                        src={
                          dataset.provider === "BlockchainML"
                            ? "/angry.png"
                            : "/hflogo.png"
                        }
                        alt={`${dataset.provider} logo`}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{dataset.provider}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {dataset.isPremium ? (
                <Badge
                  variant="default"
                  className="bg-yellow-100 text-yellow-800 flex items-center"
                >
                  <Star className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              ) : (
                <Badge
                  variant="default"
                  className="bg-green-100 hover:text-green-800 hover:bg-green-100 text-green-800 flex items-center"
                >
                  Free
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
            <div className="flex items-center text-gray-600">
              <ArrowDownToLine className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {dataset.downloads.toLocaleString()} downloads
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {new Date(dataset.lastModified).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-gray-600 col-span-2">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {dataset.cardData?.size_categories?.[0] || "Unknown size"}
              </span>
            </div>
          </div>

          <div className="flex-grow" />

          <CardFooter className="p-0 mt-4">
            <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto bg-white text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 transition-colors duration-300"
              >
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-300"
                onClick={() => router.push(`/dataset/${dataset.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" /> View Details
              </Button>
            </div>
          </CardFooter>
        </div>

        <div className="w-1/3 border-l border-gray-200 pl-4 flex flex-col">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Tags</h4>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[150px]">
            {dataset.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-600 transition-colors duration-200"
              >
                {getTagDisplayText(tag)}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}