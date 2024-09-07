import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Download, Eye } from "lucide-react";
import { useRouter } from "next/router";

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
}

const DatasetsList = ({ datasets }: { datasets: Dataset[] }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDatasets =
    datasets?.filter(
      (dataset) =>
        dataset?.cardData?.pretty_name
          ?.toLowerCase()
          ?.includes(searchTerm?.toLowerCase() ?? "") ?? false
    ) ?? [];

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Datasets</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => router.push("/create-dataset")}
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Dataset
        </Button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
            placeholder="Search datasets"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-300">Name</TableHead>
            <TableHead className="text-gray-300">Type</TableHead>
            <TableHead className="text-gray-300">Size</TableHead>
            <TableHead className="text-gray-300">Last Updated</TableHead>
            <TableHead className="text-gray-300">Downloads</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDatasets.map((dataset) => (
            <TableRow key={dataset._id} className="border-gray-700">
              <TableCell className="font-medium text-white">
                {dataset.cardData?.pretty_name || "Unnamed Dataset"}
              </TableCell>
              <TableCell className="text-gray-300">
                {dataset.cardData?.task_categories?.join(", ") || "N/A"}
              </TableCell>
              <TableCell className="text-gray-300">
                {dataset.cardData?.size_categories?.[0] || "Unknown"}
              </TableCell>
              <TableCell className="text-gray-300">
                {dataset.lastModified
                  ? new Date(dataset.lastModified).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell className="text-gray-300">
                {dataset.downloads ?? "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-400 hover:text-green-300 hover:bg-green-900"
                    onClick={() => router.push(`/dataset/${dataset.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DatasetsList;
