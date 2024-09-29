import React, { useState, useMemo } from "react";
import { NavBar } from "./component/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DatabaseIcon,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Users,
  BarChart2,
  Tag,
  PlusIcon,
} from "lucide-react";
import DatasetCardComponent from "./dataset-card";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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

const trendingData = [
  { name: "Jan", downloads: 4000, monetization: 2400 },
  { name: "Feb", downloads: 3000, monetization: 1398 },
  { name: "Mar", downloads: 5000, monetization: 3800 },
  { name: "Apr", downloads: 4500, monetization: 3908 },
  { name: "May", downloads: 6000, monetization: 4800 },
  { name: "Jun", downloads: 5500, monetization: 3800 },
];

export default function DatasetsList({ datasets }: { datasets: Dataset[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

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
            selectedTags.every((tag) => dataset.tags.includes(tag))) &&
          (activeTab === "all" || dataset.provider === activeTab)
      ),
    [datasets, searchTerm, selectedTags, activeTab]
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
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

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

    const toggleCategory = (category: string) => {
      setExpandedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    };

    return (
      <div className="flex flex-col space-y-4 h-full">
        <div className="flex-shrink-0">
          {selectedTags.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Active Filters
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="default"
                    className="cursor-pointer text-xs bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-300 flex items-center"
                    onClick={() => toggleTag(tag)}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {getTagDisplayText(tag)}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
          <Input
            placeholder="Search tags"
            value={tagSearchTerm}
            onChange={(e) => setTagSearchTerm(e.target.value)}
            className="mb-4 bg-white border-gray-200 focus:border-green-300 focus:ring-green-200 transition-all duration-300"
          />
        </div>
        <ScrollArea className="flex-grow">
          <Accordion type="multiple" className="w-full">
            {filteredTags.map(({ category, tags }) => (
              <AccordionItem value={category} key={category}>
                <AccordionTrigger
                  onClick={() => toggleCategory(category)}
                  className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  {category}{" "}
                  <Badge variant="secondary" className="ml-2">
                    {tags.length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 pt-2">
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-sans">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <NavBar />
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-light mb-8">Dataset Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Total Datasets",
              value: datasets.length.toString(),
              icon: DatabaseIcon,
            },
            {
              title: "Total Downloads",
              value: datasets
                .reduce((sum, dataset) => sum + dataset.downloads, 0)
                .toString(),
              icon: Download,
            },
            { title: "Active Users", value: "8,901", icon: Users },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-normal uppercase tracking-wide flex items-center text-gray-500">
                    <stat.icon className="w-5 h-5 mr-2 text-green-500" />
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-light text-green-600">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-white mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-light">
              Trending Datasets
            </CardTitle>
            <BarChart2 className="w-6 h-6 text-gray-400" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="downloads"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Downloads"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="monetization"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Monetization"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-light mb-6">All Datasets</h2>

        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All Datasets</TabsTrigger>
                <TabsTrigger value="BlockchainML">BlockchainML</TabsTrigger>
                <TabsTrigger value="HuggingFace">HuggingFace</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-col sm:flex-row w-full md:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search datasets..."
                  className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-md transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-300"
                onClick={() => {
                  router.push("/createDataset");
                }}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Dataset
              </Button>
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-300"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter Tags
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-[540px] bg-white text-gray-800 flex flex-col"
                >
                  <SheetHeader>
                    <SheetTitle className="text-xl font-light text-gray-700">
                      Filter by Tags
                    </SheetTitle>
                    <SheetDescription className="text-gray-500">
                      Select tags to filter the datasets. Click on a category to
                      expand or collapse it.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-grow overflow-hidden">
                    <TagsContent />
                  </div>
                  <SheetFooter className="mt-6">
                    <Button
                      className="w-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-300"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Apply Filters
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDatasets.map((dataset) => (
              <motion.div
                key={dataset._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <DatasetCardComponent dataset={dataset} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
          <div className="text-sm text-gray-500 mb-4 sm:mb-0">
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
      </main>
    </div>
  );
}
