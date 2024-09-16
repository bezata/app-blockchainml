"use client";

import React from "react";
import { NavBar } from "./component/nav-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Download,
  Users,
  TrendingUp,
  ChevronRight,
  Upload,
  Star,
  Gift,
} from "lucide-react";

// Mock data
const monetizationData = {
  totalRevenue: 152750,
  premiumDownloads: 8234,
  averageRevenuePerDownload: 18.55,
  freeUsers: 45678,
  premiumUsers: 3456,
  topEarningDatasets: [
    { name: "Global Climate Patterns", revenue: 28500, downloads: 1520 },
    { name: "Financial Market Trends", revenue: 22800, downloads: 1140 },
    { name: "AI in Healthcare", revenue: 19600, downloads: 980 },
    { name: "Renewable Energy Statistics", revenue: 17200, downloads: 860 },
    { name: "Urban Development Metrics", revenue: 15400, downloads: 770 },
  ],
  revenueByMonth: [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 18000 },
    { month: "Apr", revenue: 22000 },
    { month: "May", revenue: 26000 },
    { month: "Jun", revenue: 30000 },
  ],
  earningMethods: [
    {
      title: "Upload Premium Datasets",
      description:
        "Create and upload high-quality datasets. Earn 70% of each sale.",
      icon: Upload,
      potentialEarnings: "Up to $10,000/month",
    },
    {
      title: "Become a Verified Contributor",
      description:
        "Get verified for consistent, high-quality contributions. Earn higher royalties and priority placement.",
      icon: Star,
      potentialEarnings: "Up to $15,000/month",
    },
    {
      title: "Referral Program",
      description:
        "Invite new users to the platform. Earn 5% of their first year's purchases.",
      icon: Gift,
      potentialEarnings: "Up to $5,000/month",
    },
  ],
};

export default function MonetizationDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-sans">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <NavBar />
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 mb-12">
          <CardHeader>
            <CardTitle className="text-xl font-light text-gray-700">
              How to Earn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {monetizationData.earningMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg"
                >
                  <method.icon className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {method.description}
                  </p>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    {method.potentialEarnings}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              title: "Total Revenue",
              value: `$${monetizationData.totalRevenue.toLocaleString()}`,
              icon: DollarSign,
            },
            {
              title: "Premium Downloads",
              value: monetizationData.premiumDownloads.toLocaleString(),
              icon: Download,
            },
            {
              title: "Avg. Revenue per Download",
              value: `$${monetizationData.averageRevenuePerDownload.toFixed(
                2
              )}`,
              icon: TrendingUp,
            },
            {
              title: "Total Users",
              value: (
                monetizationData.freeUsers + monetizationData.premiumUsers
              ).toLocaleString(),
              icon: Users,
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-gray-500 uppercase tracking-wide flex items-center">
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
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-light text-gray-700">
                Top Earning Datasets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monetizationData.topEarningDatasets.map((dataset, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {dataset.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {dataset.downloads} downloads
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      ${dataset.revenue.toLocaleString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-light text-gray-700">
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monetizationData.revenueByMonth.map((month, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {month.month}
                      </span>
                      <span className="text-sm text-gray-500">
                        ${month.revenue.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={(month.revenue / 30000) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 mb-12">
          <CardHeader>
            <CardTitle className="text-xl font-light text-gray-700">
              User Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Free Users</p>
                <p className="text-2xl font-light text-gray-600">
                  {monetizationData.freeUsers.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Premium Users
                </p>
                <p className="text-2xl font-light text-green-600">
                  {monetizationData.premiumUsers.toLocaleString()}
                </p>
              </div>
            </div>
            <Progress
              value={
                (monetizationData.premiumUsers /
                  (monetizationData.freeUsers +
                    monetizationData.premiumUsers)) *
                100
              }
              className="h-2 mb-2"
            />
            <p className="text-sm text-gray-500 text-center">
              {(
                (monetizationData.premiumUsers /
                  (monetizationData.freeUsers +
                    monetizationData.premiumUsers)) *
                100
              ).toFixed(1)}
              % Premium Users
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-300">
            View Detailed Reports
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
