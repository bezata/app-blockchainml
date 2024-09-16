"use client";

import React, { useState } from "react";
import { NavBar } from "./component/nav-bar";
import { DatasetCard } from "@/components/ui/dataset-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Download, Users, Search, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const datasets = [
  {
    name: "Global Sustainability Metrics",
    downloads: "5.2k",
    type: "Environment",
    size: "2.3 GB",
    isPremium: true,
    provider: "BlockchainML",
  },
  {
    name: "Mindfulness in the Workplace",
    downloads: "3.7k",
    type: "Wellness",
    size: "1.5 GB",
    isPremium: false,
    provider: "HuggingFace",
  },
  {
    name: "Renewable Energy Trends",
    downloads: "2.9k",
    type: "Energy",
    size: "800 MB",
    isPremium: true,
    provider: "BlockchainML",
  },
  {
    name: "Urban Green Spaces Analysis",
    downloads: "1.8k",
    type: "Urban Planning",
    size: "500 MB",
    isPremium: false,
    provider: "HuggingFace",
  },
  {
    name: "AI Ethics Case Studies",
    downloads: "4.1k",
    type: "Technology",
    size: "1.2 GB",
    isPremium: true,
    provider: "BlockchainML",
  },
  {
    name: "Global Education Statistics",
    downloads: "3.3k",
    type: "Education",
    size: "900 MB",
    isPremium: false,
    provider: "HuggingFace",
  },
] as const;

const featuredDataset = {
  name: "Climate Change Impact Analysis",
  downloads: "10.5k",
  type: "Environment",
  size: "5.7 GB",
  isPremium: true,
  provider: "BlockchainML",
  description:
    "Comprehensive dataset on global climate patterns and their socio-economic impacts.",
};

const downloadData = [
  { name: "Jan", downloads: 4000 },
  { name: "Feb", downloads: 3000 },
  { name: "Mar", downloads: 5000 },
  { name: "Apr", downloads: 4500 },
  { name: "May", downloads: 6000 },
  { name: "Jun", downloads: 5500 },
];

export default function BlockchainMLApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [visibleDatasets, setVisibleDatasets] = useState(6);
  const [email, setEmail] = useState("");

  const filteredDatasets = datasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeTab === "all" || dataset.provider === activeTab)
  );

  const handleLoadMore = () => {
    setVisibleDatasets((prev) => prev + 3);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log(`Subscribed with email: ${email}`);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-sans">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <NavBar />
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-light mb-8"
        >

        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "Total Datasets", value: "1,245", icon: BrainCircuit },
            { title: "Total Downloads", value: "52,721", icon: Download },
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

        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-light flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              Featured Dataset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-xl font-medium mb-2">
                  {featuredDataset.name}
                </h3>
                <p className="mb-4 text-gray-600">
                  {featuredDataset.description}
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {featuredDataset.downloads} downloads
                  </span>
                  <span className="text-sm text-gray-500">
                    {featuredDataset.size}
                  </span>
                </div>
              </div>
              <Button className="mt-4 md:mt-0 bg-green-500 hover:bg-green-600 text-white transition-colors duration-300">
                Explore Dataset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-light">
              Download Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={downloadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="downloads"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <h2 className="text-2xl font-light mb-4 sm:mb-0">
            Trending Datasets
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search datasets..."
              className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-md transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
              All Datasets
            </TabsTrigger>
            <TabsTrigger
              value="BlockchainML"
              onClick={() => setActiveTab("BlockchainML")}
            >
              BlockchainML
            </TabsTrigger>
            <TabsTrigger
              value="HuggingFace"
              onClick={() => setActiveTab("HuggingFace")}
            >
              HuggingFace
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDatasets.slice(0, visibleDatasets).map((dataset) => (
              <motion.div
                key={dataset.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <DatasetCard {...dataset} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {visibleDatasets < filteredDatasets.length && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              className="hover:text-green-700 transition-colors duration-300"
            >
              Load More
            </Button>
          </div>
        )}

        <Card className="mt-12 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-light">Stay Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-white border-gray-200"
                required
              />
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
              >
                Subscribe to Newsletter
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
