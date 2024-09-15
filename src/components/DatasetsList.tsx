"use client";

import React, { useState, useRef, useMemo } from "react";
import { NavBar } from "./component/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Plus,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
}

const ITEMS_PER_PAGE = 20;

const categorizeTag = (tag: string) => {
  if (tag.startsWith("task_categories:")) return "Task";
  if (tag.startsWith("task_ids:")) return "Task ID";
  if (tag.startsWith("annotations_creators:")) return "Annotations";
  if (tag.startsWith("language_creators:")) return "Language Creator";
  if (tag.startsWith("multilinguality:")) return "Multilinguality";
  if (tag.startsWith("source_datasets:")) return "Source";
  if (tag.startsWith("size_categories:")) return "Size";
  if (tag.startsWith("format:")) return "Format";
  if (tag.startsWith("modality:")) return "Modality";
  if (tag.startsWith("library:")) return "Library";
  if (tag.startsWith("license:")) return "License";
  return "Other";
};

const getTagDisplayText = (tag: string) => {
  const parts = tag.split(":");
  return parts.length > 1 ? parts[1] : tag;
};

export default function BlockchainMLDatasetBrowser({
  datasets,
}: {
  datasets: Dataset[];
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categorizedTags = useMemo(() => {
    const tags: { [key: string]: Set<string> } = {};
    datasets.forEach((dataset) => {
      dataset.tags.forEach((tag) => {
        const category = categorizeTag(tag);
        if (!tags[category]) tags[category] = new Set();
        tags[category].add(tag);
      });
    });
    return Object.entries(tags)
      .map(([category, tagSet]) => ({
        category,
        tags: Array.from(tagSet),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [datasets]);

  const filteredDatasets = useMemo(
    () =>
      datasets.filter(
        (dataset) =>
          (dataset.cardData?.pretty_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ??
            false) &&
          (selectedTags.length === 0 ||
            selectedTags.every((tag) => dataset.tags.includes(tag)))
      ),
    [datasets, searchTerm, selectedTags]
  );

  const totalPages = Math.ceil(filteredDatasets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDatasets = filteredDatasets.slice(startIndex, endIndex);

  const goToNextPage = () =>
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((page) => Math.max(page - 1, 1));

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const TagsContent = () => {
    const [tagSearchTerm, setTagSearchTerm] = useState("");
    const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const getSelectedTagCount = (category: string) => {
      const tagsInCategory =
        filteredTags.find((c) => c.category === category)?.tags || [];
      return tagsInCategory.filter((tag) => selectedTags.includes(tag)).length;
    };

    const handleScrollToCategory = (category: string) => {
      if (categoryRefs.current[category]) {
        categoryRefs.current[category]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    const filteredTags = useMemo(() => {
      return categorizedTags.map((category) => ({
        ...category,
        tags: category.tags.filter((tag) =>
          getTagDisplayText(tag)
            .toLowerCase()
            .includes(tagSearchTerm.toLowerCase())
        ),
      }));
    }, [tagSearchTerm]);

    return (
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2">
          {filteredTags.map(({ category }) => {
            const count = getSelectedTagCount(category);
            return (
              <Button
                key={category}
                variant="ghost"
                onClick={() => handleScrollToCategory(category)}
                className="text-gray-600 hover:text-gray-800 relative transition-colors duration-300"
              >
                {category}
                {count > 0 && (
                  <span className="absolute right-0 top-0 text-xs bg-green-100 text-green-800 px-1 rounded-full">
                    {count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
        <Input
          placeholder="Search tags"
          value={tagSearchTerm}
          onChange={(e) => setTagSearchTerm(e.target.value)}
          className="mb-4 bg-white border-gray-200 focus:border-green-300 focus:ring-green-200 transition-all duration-300"
        />
        <div
          className="max-h-[calc(100vh-200px)] overflow-y-auto pr-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#E2E8F0 #F8FAFC",
          }}
        >
          {filteredTags.map(({ category, tags }) => (
            <div
              key={category}
              ref={(el) => {
                if (el) categoryRefs.current[category] = el;
              }}
              className="mb-6"
            >
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      selectedTags.includes(tag) ? "default" : "secondary"
                    }
                    className="cursor-pointer text-xs bg-gray-100 text-gray-800 hover:bg-green-100 hover:text-green-800 transition-colors duration-300"
                    onClick={() => toggleTag(tag)}
                  >
                    {getTagDisplayText(tag)}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-white to-gray-100 text-gray-800 font-sans">
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50 shadow-sm">
          <NavBar />
        </header>

        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-light text-gray-700">
              Blockchain Datasets
            </h1>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
              onClick={() => router.push("/create-dataset")}
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Dataset
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-md transition-all duration-300"
                placeholder="Search datasets"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-300"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter Tags
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white text-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-gray-700">
                    Filter by Tags
                  </SheetTitle>
                  <SheetDescription className="text-gray-500">
                    Select tags to filter the datasets
                  </SheetDescription>
                </SheetHeader>
                <TagsContent />
              </SheetContent>
            </Sheet>
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="default"
                  className="cursor-pointer text-xs bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-300"
                  onClick={() => toggleTag(tag)}
                >
                  {getTagDisplayText(tag)}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDatasets.map((dataset) => (
              <Card
                key={dataset._id}
                className="bg-white border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-700">
                      {dataset.cardData?.pretty_name || "Unnamed Dataset"}
                    </h3>
                    {dataset.isPremium && (
                      <Badge
                        variant="default"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Size:</span>
                      <span className="text-gray-700">
                        {dataset.cardData?.size_categories?.[0] || "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Downloads:</span>
                      <span className="text-gray-700">
                        {dataset.downloads ?? "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="text-gray-700">
                        {new Date(dataset.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
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

                  <div className="flex justify-between">
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
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredDatasets.length)} of{" "}
              {filteredDatasets.length} datasets
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="text-gray-600 border-gray-200 hover: bg-gray-50 transition-colors duration-300"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="text-gray-600 border-gray-200 hover:bg-gray-50 transition-colors duration-300"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
