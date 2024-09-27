import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  BarChart2,
  Gift,
  Clock,
  Users,
} from "lucide-react";
import { NavBar } from "@/components/component/nav-bar";

export default function UserEarningPage() {
  const [activeTab, setActiveTab] = useState("overview");

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
    { id: 1, type: "Dataset Usage", amount: 15.0, date: "2023-06-01" },
    { id: 2, type: "Model Contribution", amount: 50.0, date: "2023-05-28" },
    { id: 3, type: "Referral Bonus", amount: 10.0, date: "2023-05-25" },
    { id: 4, type: "Dataset Usage", amount: 25.0, date: "2023-05-20" },
    { id: 5, type: "Model Usage", amount: 30.0, date: "2023-05-15" },
  ];

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Earnings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {earningStats.map((stat, index) => (
            <Card key={index}>
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
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="methods">Earning Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
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

            <Card>
              <CardHeader>
                <CardTitle>Monthly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end justify-between">
                  {[40, 70, 55, 90, 60, 80].map((height, index) => (
                    <motion.div
                      key={index}
                      className="bg-green-500 w-8 rounded-t-md"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-t">
                        <td className="py-2">{transaction.type}</td>
                        <td className="py-2">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="py-2">{transaction.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods" className="space-y-4">
            {earningMethods.map((method, index) => (
              <Card key={index}>
                <CardContent className="flex items-start p-6">
                  <method.icon className="w-12 h-12 text-green-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600">{method.description}</p>
                    <Button className="mt-4">Learn More</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
