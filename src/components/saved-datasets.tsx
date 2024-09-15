import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Dataset {
  id: string;
  author: string;
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
    author: "OpenAI",
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
    author: "Google Research",
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
    author: "Mozilla",
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

export function SavedDatasetsComponent() {
  const [savedDatasets, setSavedDatasets] =
    useState<Dataset[]>(initialDatasets);

  const removeDataset = (id: string) => {
    setSavedDatasets((prevDatasets) =>
      prevDatasets.filter((dataset) => dataset.id !== id)
    );
  };

  const formatSize = (size: number) => {
    const sizeInMB = size / (1024 * 1024);
    return `${sizeInMB.toFixed(2)} MB`;
  };

  return (
    <div className="h-full bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-gray-800">
              Saved Datasets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[70vh]">
              <AnimatePresence>
                {savedDatasets.map((dataset) => (
                  <motion.div
                    key={dataset.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="mb-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-medium text-gray-800 mb-1">
                              {dataset.cardData.pretty_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              by {dataset.author}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDataset(dataset.id)}
                            className="text-gray-500 hover:text-red-600 transition-colors duration-300"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove dataset</span>
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600">
                              License:{" "}
                              <span className="font-medium">
                                {dataset.cardData.license}
                              </span>
                            </p>
                            <p className="text-gray-600">
                              Language:{" "}
                              <span className="font-medium">
                                {dataset.cardData.language}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              Dataset Size:{" "}
                              <span className="font-medium">
                                {formatSize(
                                  dataset.cardData.dataset_info.dataset_size
                                )}
                              </span>
                            </p>
                            <p className="text-gray-600">
                              Download Size:{" "}
                              <span className="font-medium">
                                {formatSize(
                                  dataset.cardData.dataset_info.download_size
                                )}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
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
                        <div className="flex justify-between items-center text-sm">
                          <p className="text-gray-600">
                            Last Modified:{" "}
                            {new Date(
                              dataset.lastModified
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600">
                            Downloads: {dataset.downloads.toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-100 p-4 flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors duration-300"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Dataset
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 transition-colors duration-300"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
          <CardFooter className="justify-between border-t p-6">
            <p className="text-sm text-gray-600">
              {savedDatasets.length} datasets saved
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSavedDatasets([])}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-300"
            >
              Clear All
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
