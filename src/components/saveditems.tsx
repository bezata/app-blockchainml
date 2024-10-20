"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavBar } from "./component/nav-bar";

interface Dataset {
  id: string;
  author: {
    name: string;
    avatar: string;
    tags: string[];
  };
  cardData: {
    pretty_name: string;
    license: string;
    language: string;
    dataset_info: {
      dataset_size: number;
      download_size: number;
    };
  };
  lastModified: string;
  downloads: number;
  tags: string[];
}

const initialDatasets: Dataset[] = [
  {
    id: "dataset1",
    author: {
      name: "OpenAI",
      avatar: "https://github.com/shadcn.png",
      tags: ["AI Research", "NLP"],
    },
    cardData: {
      pretty_name: "GPT-3 Language Model Dataset",
      license: "MIT",
      language: "English",
      dataset_info: {
        dataset_size: 570000000,
        download_size: 180000000,
      },
    },
    lastModified: "2023-06-15",
    downloads: 50000,
    tags: ["NLP", "Language Model", "Machine Learning"],
  },
  {
    id: "dataset2",
    author: {
      name: "Google Research",
      avatar: "https://github.com/shadcn.png",
      tags: ["Computer Vision", "ML"],
    },
    cardData: {
      pretty_name: "ImageNet",
      license: "Apache 2.0",
      language: "Multiple",
      dataset_info: {
        dataset_size: 150000000,
        download_size: 55000000,
      },
    },
    lastModified: "2023-05-20",
    downloads: 100000,
    tags: ["Computer Vision", "Image Classification", "Deep Learning"],
  },
  {
    id: "dataset3",
    author: {
      name: "Mozilla",
      avatar: "https://github.com/shadcn.png",
      tags: ["Open Source", "Speech Recognition"],
    },
    cardData: {
      pretty_name: "Common Voice",
      license: "CC0",
      language: "Multiple",
      dataset_info: {
        dataset_size: 80000000,
        download_size: 30000000,
      },
    },
    lastModified: "2023-06-01",
    downloads: 25000,
    tags: ["Speech Recognition", "Audio", "Multi-language"],
  },
];

export default function SavedDatasetsPage() {
  const [savedDatasets, setSavedDatasets] =
    useState<Dataset[]>(initialDatasets);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "downloads" | "size">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [expandedDataset, setExpandedDataset] = useState<string | null>(null);

  const removeDataset = (id: string) => {
    setSavedDatasets((prevDatasets) =>
      prevDatasets.filter((dataset) => dataset.id !== id)
    );
  };

  const formatSize = (size: number) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  const allTags = Array.from(
    new Set(
      savedDatasets.flatMap((dataset) => [
        ...dataset.tags,
        ...dataset.author.tags,
      ])
    )
  );

  const filteredAndSortedDatasets = savedDatasets
    .filter(
      (dataset) =>
        dataset.cardData.pretty_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        (selectedTags.length === 0 ||
          selectedTags.some((tag) =>
            [...dataset.tags, ...dataset.author.tags].includes(tag)
          ))
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.cardData.pretty_name.localeCompare(
          b.cardData.pretty_name
        );
      } else if (sortBy === "downloads") {
        comparison = a.downloads - b.downloads;
      } else if (sortBy === "size") {
        comparison =
          a.cardData.dataset_info.dataset_size -
          b.cardData.dataset_info.dataset_size;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const toggleSort = (newSortBy: "name" | "downloads" | "size") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedDataset(expandedDataset === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className=" mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white gap-2 font-bold text-green-500 hover:bg-green-500 hover:text-white hover:font-bold"
                >
                  <Filter size={18} />
                  <span>Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 bg-gray-100">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Filter by tags:
                </h3>
                <ScrollArea className="h-72">
                  <div className="space-y-2">
                    {allTags.map((tag) => (
                      <div key={tag} className="flex items-center">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTags([...selectedTags, tag]);
                            } else {
                              setSelectedTags(
                                selectedTags.filter((t) => t !== tag)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={`tag-${tag}`} className="ml-2">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
          {savedDatasets.length === 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <Image
                src="/angry.png"
                alt="BlockchainML"
                width={100}
                height={100}
                className="mx-auto"
              />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No datasets? No problem!
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Your dataset collection is as empty as a politician&apos;s
                promises.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Time to fill it up with some data goodness!
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    // Add a sample dataset for demonstration
                    setSavedDatasets([...initialDatasets.slice(0, 1)]);
                  }}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Add a Sample Dataset
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredAndSortedDatasets.map((dataset) => (
                    <motion.li
                      key={dataset.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={dataset.author.avatar}
                                alt={dataset.author.name}
                              />
                              <AvatarFallback>
                                {dataset.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                              <h3 className="text-lg font-medium text-gray-900">
                                {dataset.cardData.pretty_name}
                              </h3>
                              <p className="text-sm text-gray-800">
                                by {dataset.author.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white text-green-500 hover:bg-green-500 hover:text-white hover:font-bold"
                            >
                              <Download
                                size={16}
                                className="mr-1 hover:text-white"
                              />
                              Download
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpand(dataset.id)}
                              className="text-green-500 hover:text-green-600"
                            >
                              {expandedDataset === dataset.id ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                              <span className="sr-only">Toggle details</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDataset(dataset.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                              <span className="sr-only">Remove dataset</span>
                            </Button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {expandedDataset === dataset.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4"
                            >
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="font-semibold text-gray-600">
                                    License
                                  </p>
                                  <p className="text-gray-600 ">
                                    {dataset.cardData.license}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-600">
                                    Language
                                  </p>
                                  <p className="text-gray-600 ">
                                    {dataset.cardData.language}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-600">
                                    Dataset Size
                                  </p>
                                  <p className="text-gray-600 ">
                                    {formatSize(
                                      dataset.cardData.dataset_info.dataset_size
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-600">
                                    Download Size
                                  </p>
                                  <p className="text-gray-600 ">
                                    {formatSize(
                                      dataset.cardData.dataset_info
                                        .download_size
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-600">
                                    Last Modified
                                  </p>
                                  <p className="text-gray-600 ">
                                    {new Date(
                                      dataset.lastModified
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-600">
                                    Downloads
                                  </p>
                                  <p className="text-gray-600 ">
                                    {dataset.downloads.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4">
                                <p className="font-semibold text-gray-600 mb-2">
                                  Dataset Tags
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {dataset.tags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="bg-green-100 text-green-800"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="mt-4">
                                <p className="font-semibold text-gray-600 mb-2">
                                  Author Tags
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {dataset.author.tags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className="border-yellow-500 text-yellow-700"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
