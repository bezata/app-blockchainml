"use client";

import React, { useState, useRef, useMemo } from "react";
import { NavBar } from "../components/component/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";
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

interface AIModel {
  _id: string;
  id: string;
  cardData: {
    name: string;
    task_categories: string[];
    model_size: string;
  };
  lastUpdated: string;
  downloads: number;
  tags: string[];
  isPremium: boolean;
}

const ITEMS_PER_PAGE = 20;

const categorizeTag = (tag: string) => {
  if (tag.startsWith("task:")) return "Task";
  if (tag.startsWith("architecture:")) return "Architecture";
  if (tag.startsWith("language:")) return "Language";
  if (tag.startsWith("size:")) return "Size";
  if (tag.startsWith("license:")) return "License";
  if (tag.startsWith("framework:")) return "Framework";
  return "Other";
};

const getTagDisplayText = (tag: string) => {
  const parts = tag.split(":");
  return parts.length > 1 ? parts[1] : tag;
};

const mockModels: AIModel[] = [
  {
    _id: "1",
    id: "gpt-3",
    cardData: {
      name: "GPT-3",
      task_categories: ["Natural Language Processing"],
      model_size: "175B",
    },
    lastUpdated: "2023-06-01",
    downloads: 1000000,
    tags: ["task:nlp", "architecture:transformer", "size:large"],
    isPremium: true,
  },
  {
    _id: "2",
    id: "bert-base",
    cardData: {
      name: "BERT Base",
      task_categories: ["Text Classification", "Named Entity Recognition"],
      model_size: "110M",
    },
    lastUpdated: "2023-05-15",
    downloads: 500000,
    tags: [
      "task:classification",
      "task:ner",
      "architecture:transformer",
      "size:medium",
    ],
    isPremium: false,
  },
];

export default function AIModelBrowser({
  models = mockModels,
}: {
  models?: AIModel[];
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categorizedTags = useMemo(() => {
    const tags: { [key: string]: Set<string> } = {};
    models.forEach((model) => {
      model.tags.forEach((tag) => {
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
  }, [models]);

  const filteredModels = useMemo(
    () =>
      models.filter(
        (model) =>
          (model.cardData?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ??
            false) &&
          (selectedTags.length === 0 ||
            selectedTags.every((tag) => model.tags.includes(tag)))
      ),
    [models, searchTerm, selectedTags]
  );

  const totalPages = Math.ceil(filteredModels.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentModels = filteredModels.slice(startIndex, endIndex);

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
            <h1 className="text-3xl font-light flex items-center text-gray-700">
              <BrainCircuit className="mr-2 mt-1" /> AI Models
            </h1>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
              onClick={() => router.push("/createModel")}
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Model
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-md transition-all duration-300"
                placeholder="Search AI models"
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
                    Select tags to filter the AI models
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
            {currentModels.map((model) => (
              <Card
                key={model._id}
                className="bg-white border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-700">
                      {model.cardData?.name || "Unnamed Model"}
                    </h3>
                    {model.isPremium && (
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
                      <span className="text-gray-500">Task:</span>
                      <span className="text-gray-700">
                        {model.cardData?.task_categories?.[0] || "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Size:</span>
                      <span className="text-gray-700">
                        {model.cardData?.model_size || "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Downloads:</span>
                      <span className="text-gray-700">
                        {model.downloads ?? "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="text-gray-700">
                        {new Date(model.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {model.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-600"
                      >
                        {getTagDisplayText(tag)}
                      </Badge>
                    ))}
                    {model.tags.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-600"
                      >
                        +{model.tags.length - 3} more
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
                      onClick={() => router.push(`/model/${model.id}`)}
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
              {Math.min(endIndex, filteredModels.length)} of{" "}
              {filteredModels.length} models
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="text-gray-600 border-gray-200 hover:bg-gray-50 transition-colors duration-300"
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
