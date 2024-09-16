import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Star } from "lucide-react";

interface DatasetCardProps {
  name: string;
  downloads: string;
  type: string;
  size: string;
  isPremium?: boolean;
  provider: "BlockchainML" | "HuggingFace";
}

export function DatasetCard({
  name,
  downloads,
  type,
  size,
  isPremium,
  provider,
}: DatasetCardProps) {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800"
          >
            {type}
          </Badge>
          <div className="flex items-center space-x-2">
            {isPremium && (
              <Badge
                variant="default"
                className="bg-yellow-100 text-yellow-800"
              >
                <Star className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            <Image
              src={provider === "BlockchainML" ? "/angry.png" : "/hflogo.png"}
              alt={`${provider} logo`}
              width={40}
              height={40}
            />
          </div>
        </div>
        <CardTitle className="text-xl font-light mt-2 text-gray-700">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>{downloads} downloads</span>
          <span>{size}</span>
        </div>
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-green-600 transition-colors duration-300"
          >
            <Download className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-gray-200 text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors duration-300"
          >
            Explore
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
