import React, { useState, useRef, useMemo } from "react";
import { NavBar } from "./component/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

    // Calculate the number of selected tags per category
    const getSelectedTagCount = (category: string) => {
      const tagsInCategory =
        filteredTags.find((c) => c.category === category)?.tags || [];
      return tagsInCategory.filter((tag) => selectedTags.includes(tag)).length;
    };

    // Handle scroll to category
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
        {/* Buttons for Category List */}
        <div className="flex flex-wrap gap-2">
          {filteredTags.map(({ category }) => {
            const count = getSelectedTagCount(category);
            return (
              <Button
                key={category}
                variant="ghost"
                onClick={() => handleScrollToCategory(category)}
                className="text-gray-300 hover:text-white relative"
              >
                {category}
                {count > 0 && (
                  <span className="absolute right-0 text-xs text-white">
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
          className="mb-4"
        />
        {/* Input and Scrollable Tags Content */}
        <div
          className="max-h-[calc(100vh-200px)] overflow-y-auto"
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
          }}
        >
          {filteredTags.map(({ category, tags }) => (
            <div
              key={category}
              ref={(el) => {
                if (el) categoryRefs.current[category] = el;
              }}
              className="mb-4"
            >
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      selectedTags.includes(tag) ? "default" : "secondary"
                    }
                    className="cursor-pointer text-xs"
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
    <div className="flex h-screen bg-gray-300 ">
      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="night border-b border-gray-700 p-2 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <NavBar />
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 bg-gray-300" />
              <Input
                className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-600 bg-gray-300 text-black placeholder-black"
                placeholder="Search datasets and models"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Upgrade to Pro
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold eerieblack  ">
              Blockchain Datasets
            </h1>
            <Button
              className="bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-600 hover:to-orange-400 text-white"
              onClick={() => router.push("/create-dataset")}
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Dataset
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto night border-gray-600 hover:bg-gray-700"
                >
                  <Filter className="mr-2 h-4 w-4 " />
                  Filter Tags
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter by Tags</SheetTitle>
                  <SheetDescription>
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
                  className="cursor-pointer text-xs bg-blue-600 hover:bg-blue-700 transition-colors"
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
                className="night border-gray-700 overflow-hidden group hover:shadow-lg hover:shadow-black transition-all duration-300"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white ">
                      {dataset.cardData?.pretty_name || "Unnamed Dataset"}
                    </h3>
                    {dataset.isPremium && (
                      <Badge
                        variant="default"
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>

                  <div className="flex ">
                    <p className="text-m text-gray-400">Size:</p>
                    <p className="text-sm text-white ">
                      {dataset.cardData?.size_categories?.[0] || "Unknown"}
                    </p>
                  </div>
                  <div className="flex ">
                    <p className="text-m text-gray-400">Downloads:</p>
                    <p className="text-sm text-white">
                      {dataset.downloads ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-m text-gray-400"> Last Updated:</p>
                    <p className="text-sm text-white">
                      {new Date(dataset.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dataset.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-gray-700 text-gray-300"
                      >
                        {getTagDisplayText(tag)}
                      </Badge>
                    ))}
                    {dataset.tags.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-700 text-gray-300"
                      >
                        +{dataset.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="   bg-green-700 text-white hover:text-green-300 hover:bg-green-900 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-700 text-white hover:text-blue-300 hover:bg-blue-900 transition-colors"
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
            <div className="text-sm text-gray-400">
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
                className="text-gray-300 border-gray-600 hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="text-gray-300 border-gray-600 hover:bg-gray-700 transition-colors"
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
