"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavBar } from "./component/nav-bar";
import {
  Search,
  LayoutDashboard,
  Database,
  Box,
  BookMarked,
  Settings,
  LogOut,
  ChevronRight,
  Download,
  Star,
} from "lucide-react";
import { useRouter } from "next/router";

export function BlockchainMlApp() {
  const router = useRouter();
  return (
    <div className="flex h-screen bg-gray-300">
      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="night border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <NavBar />
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-600 bg-gray-300 text-black placeholder-gray-500"
                placeholder="Search datasets and models"
                type="search"
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

        {/* Dashboard Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-black">Dashboard</h1>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="night border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Downloads
                </CardTitle>
                <Database className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">1,234</div>
                <p className="text-xs text-gray-400">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card className="night border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Active Models
                </CardTitle>
                <Box className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">23</div>
                <p className="text-xs text-gray-400">+2 new this week</p>
              </CardContent>
            </Card>
            <Card className="night border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Saved Items
                </CardTitle>
                <BookMarked className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">15</div>
                <p className="text-xs text-gray-400">5 datasets, 10 models</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Items */}
          <h2 className="text-xl font-semibold mb-4 text-black">
            Recent Items
          </h2>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                type: "Dataset",
                name: "Ethereum Transactions 2023",
                downloads: "5.2k",
                badge: "Free",
              },
              {
                type: "Model",
                name: "CryptoPredict v2",
                rating: "4.8",
                badge: "Premium",
              },
              {
                type: "Dataset",
                name: "DeFi Protocols Analysis",
                downloads: "3.7k",
                badge: "Free",
              },
              {
                type: "Model",
                name: "Blockchain Anomaly Detector",
                rating: "4.6",
                badge: "Premium",
              },
            ].map((item, index) => (
              <Card key={index} className="night border-gray-700">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <Badge
                      variant="secondary"
                      className="bg-gray-700 text-gray-300"
                    >
                      {item.type}
                    </Badge>
                    <CardTitle className="text-lg mt-2 text-white">
                      {item.name}
                    </CardTitle>
                  </div>
                  <Badge
                    variant={item.badge === "Premium" ? "default" : "secondary"}
                    className={
                      item.badge === "Premium"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }
                  >
                    {item.badge}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    {item.downloads ? (
                      <div className="flex items-center">
                        <Download className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {item.downloads} Downloads
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Star className="mr-2 h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">
                          {item.rating} Rating
                        </span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      View <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
