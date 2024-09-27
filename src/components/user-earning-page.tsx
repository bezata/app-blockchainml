"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  BarChart2,
  Gift,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Calendar,
  Search,
  Download,
} from "lucide-react";
import { NavBar } from "@/components/component/nav-bar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function UserEarningPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [transactionPeriod, setTransactionPeriod] = useState("all");
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const earningStats = [
    {
      title: "Total Earnings",
      value: "$1,234.56",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "This Month",
      value: "$234.56",
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      title: "Pending",
      value: "$56.78",
      icon: Clock,
      color: "text-yellow-500",
    },
  ];

  const earningMethods = [
    {
      title: "Dataset Contributions",
      description: "Earn by sharing your valuable datasets",
      icon: BarChart2,
    },
    {
      title: "Model Usage",
      description: "Get paid when others use your AI models",
      icon: Users,
    },
    {
      title: "Referrals",
      description: "Invite friends and earn a bonus",
      icon: Gift,
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      type: "Dataset Usage",
      amount: 15.0,
      date: "2023-06-01",
      status: "Completed",
      dataset: "Image Classification Dataset",
    },
    {
      id: 2,
      type: "Model Contribution",
      amount: 50.0,
      date: "2023-05-28",
      status: "Pending",
      model: "NLP Transformer Model",
    },
    {
      id: 3,
      type: "Referral Bonus",
      amount: 10.0,
      date: "2023-05-25",
      status: "Completed",
      referral: "john@example.com",
    },
    {
      id: 4,
      type: "Dataset Usage",
      amount: 25.0,
      date: "2023-05-20",
      status: "Completed",
      dataset: "Sentiment Analysis Dataset",
    },
    {
      id: 5,
      type: "Model Usage",
      amount: 30.0,
      date: "2023-05-15",
      status: "Completed",
      model: "Object Detection Model",
    },
  ];

  const monthlyEarnings = [
    { name: "Jan", earnings: 500 },
    { name: "Feb", earnings: 700 },
    { name: "Mar", earnings: 600 },
    { name: "Apr", earnings: 900 },
    { name: "May", earnings: 800 },
    { name: "Jun", earnings: 1000 },
  ];

  const filteredTransactions = recentTransactions
    .filter((transaction) => {
      if (transactionPeriod === "all") return true;
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      switch (transactionPeriod) {
        case "week":
          return (
            now.getTime() - transactionDate.getTime() <= 7 * 24 * 60 * 60 * 1000
          );
        case "month":
          return (
            now.getMonth() === transactionDate.getMonth() &&
            now.getFullYear() === transactionDate.getFullYear()
          );
        case "year":
          return now.getFullYear() === transactionDate.getFullYear();
        default:
          return true;
      }
    })
    .filter((transaction) =>
      Object.values(transaction).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortColumn === "date") {
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortColumn === "amount") {
        return sortDirection === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-sans">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <NavBar />
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Earnings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {earningStats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CardContent className="flex items-center p-6">
                <stat.icon className={`w-12 h-12 ${stat.color} mr-4`} />
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md px-4 py-2 transition-colors duration-200"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md px-4 py-2 transition-colors duration-200"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="methods"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md px-4 py-2 transition-colors duration-200"
            >
              Earning Methods
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Dataset Contributions
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        60%
                      </span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Model Usage
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        30%
                      </span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Referrals
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        10%
                      </span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Monthly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="earnings"
                        stroke="#10B981"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Recent Transactions</span>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="period">Period:</Label>
                    <Select
                      value={transactionPeriod}
                      onValueChange={setTransactionPeriod}
                    >
                      <SelectTrigger id="period" className="w-[120px]">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All time</SelectItem>
                        <SelectItem value="week">This week</SelectItem>
                        <SelectItem value="month">This month</SelectItem>
                        <SelectItem value="year">This year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-64 border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-md transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th
                          className="pb-2 cursor-pointer"
                          onClick={() => handleSort("date")}
                        >
                          Date
                          {sortColumn === "date" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? (
                                <ChevronUp className="inline w-4 h-4" />
                              ) : (
                                <ChevronDown className="inline w-4 h-4" />
                              )}
                            </span>
                          )}
                        </th>
                        <th className="pb-2">Type</th>
                        <th
                          className="pb-2 cursor-pointer"
                          onClick={() => handleSort("amount")}
                        >
                          Amount
                          {sortColumn === "amount" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? (
                                <ChevronUp className="inline w-4 h-4" />
                              ) : (
                                <ChevronDown className="inline w-4 h-4" />
                              )}
                            </span>
                          )}
                        </th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredTransactions.map((transaction) => (
                          <motion.tr
                            key={transaction.id}
                            className="border-t"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <td className="py-2">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                {transaction.date}
                              </div>
                            </td>
                            <td className="py-2">{transaction.type}</td>
                            <td className="py-2">
                              ${transaction.amount.toFixed(2)}
                            </td>
                            <td className="py-2">
                              <Badge
                                variant={
                                  transaction.status === "Completed"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs font-semibold"
                              >
                                {transaction.status}
                              </Badge>
                            </td>
                            <td className="py-2">
                              {transaction.dataset && (
                                <span className="text-sm text-gray-600">
                                  {transaction.dataset}
                                </span>
                              )}
                              {transaction.model && (
                                <span className="text-sm text-gray-600">
                                  {transaction.model}
                                </span>
                              )}
                              {transaction.referral && (
                                <span className="text-sm text-gray-600">
                                  {transaction.referral}
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods" className="space-y-4">
            {earningMethods.map((method, index) => (
              <Card
                key={index}
                className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <CardContent className="flex items-start p-6">
                  <method.icon className="w-12 h-12 text-green-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    <Button className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-200">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
