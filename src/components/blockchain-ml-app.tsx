"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ChevronRight } from "lucide-react";
import { NavBar } from "./component/nav-bar";

export default function BlockchainMlApp() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <NavBar />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-light text-gray-700 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "Curated Datasets", value: "124" },
            { title: "Total Downloads", value: "8,721" },
            { title: "Active Users", value: "3,891" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-gray-500 uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-light text-green-600">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-light mb-6 text-gray-700">
          Featured Datasets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Global Sustainability Metrics",
              downloads: "5.2k",
              type: "Environment",
              size: "2.3 GB",
            },
            {
              name: "Mindfulness in the Workplace",
              downloads: "3.7k",
              type: "Wellness",
              size: "1.5 GB",
            },
            {
              name: "Renewable Energy Trends",
              downloads: "2.9k",
              type: "Energy",
              size: "800 MB",
            },
            {
              name: "Urban Green Spaces Analysis",
              downloads: "1.8k",
              type: "Urban Planning",
              size: "500 MB",
            },
          ].map((dataset, index) => (
            <Card
              key={index}
              className="bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800"
                  >
                    {dataset.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-green-600 transition-colors duration-300"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
                <CardTitle className="text-xl font-light mt-2 text-gray-700">
                  {dataset.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{dataset.downloads} downloads</span>
                  <span>{dataset.size}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-gray-200 text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors duration-300"
                >
                  Explore
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
