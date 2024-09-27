import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Search,
  ArrowRight,
  Loader2,
  Menu,
  X,
  Info,
  Calendar,
  Users,
  Coins,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandDiscord,
} from "@tabler/icons-react";

export function BlockchainmlExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  const stats = [
    {
      label: "Weekly Payments",
      value: "Every Sunday",
      icon: Calendar,
      info: "Payments are processed and sent out every Sunday at 23:59 UTC",
      symbol: "📅",
    },
    {
      label: "Users Paid Last Week",
      value: "5,678",
      icon: Users,
      info: "Number of users who received payments in the last payout period",
      symbol: "👥",
    },
    {
      label: "BML Token Supply",
      value: "10,000,000",
      icon: Coins,
      info: "Total supply of BML tokens in circulation",
      symbol: "🪙",
    },
    {
      label: "BML Price",
      value: "$0.0234",
      icon: DollarSign,
      info: "Current market price of BML token",
      symbol: "💹",
    },
  ];

  const transactions = [
    {
      user: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      amount: 500,
      timestamp: "2023-06-15 14:30:45",
      datasets: 3,
      datasetNames: [
        "Image Classification",
        "Sentiment Analysis",
        "Object Detection",
      ],
      chain: "Ethereum",
      chainSymbol: "ETH",
    },
    {
      user: "Bob Smith",
      avatar: "https://i.pravatar.cc/150?img=2",
      amount: 750,
      timestamp: "2023-06-15 14:29:30",
      datasets: 2,
      datasetNames: ["Natural Language Processing", "Time Series Forecasting"],
      chain: "Binance Smart Chain",
      chainSymbol: "BSC",
    },
    {
      user: "Charlie Brown",
      avatar: "https://i.pravatar.cc/150?img=3",
      amount: 1000,
      timestamp: "2023-06-15 14:28:15",
      datasets: 1,
      datasetNames: ["Anomaly Detection"],
      chain: "Polygon",
      chainSymbol: "MATIC",
    },
    {
      user: "Diana Prince",
      avatar: "https://i.pravatar.cc/150?img=4",
      amount: 250,
      timestamp: "2023-06-15 14:27:00",
      datasets: 4,
      datasetNames: [
        "Speech Recognition",
        "Recommendation System",
        "Fraud Detection",
        "Image Segmentation",
      ],
      chain: "Solana",
      chainSymbol: "SOL",
    },
    {
      user: "Ethan Hunt",
      avatar: "https://i.pravatar.cc/150?img=5",
      amount: 1500,
      timestamp: "2023-06-15 14:25:45",
      datasets: 2,
      datasetNames: ["Reinforcement Learning", "Generative Models"],
      chain: "Avalanche",
      chainSymbol: "AVAX",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      console.log("Searching for:", searchQuery);
    }, 1500);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-beige-100 text-gray-800 font-sans"
      style={{ fontFamily: "'Poppins', 'Open Sans', sans-serif" }}
    >
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-light text-gray-700 mr-8">
                BlockchainML
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/explorer"
                  className={`text-gray-600 hover:text-green-600 transition-colors duration-200 ${
                    router.pathname === "/explorer" ? "text-green-600" : ""
                  }`}
                >
                  Explorer
                </Link>
                <Link
                  href="/transactions"
                  className={`text-gray-600 hover:text-green-600 transition-colors duration-200 ${
                    router.pathname === "/transactions" ? "text-green-600" : ""
                  }`}
                >
                  Transactions
                </Link>
                <Link
                  href="/tokens"
                  className={`text-gray-600 hover:text-green-600 transition-colors duration-200 ${
                    router.pathname === "/tokens" ? "text-green-600" : ""
                  }`}
                >
                  Tokens
                </Link>
                <Link
                  href="/resources"
                  className={`text-gray-600 hover:text-green-600 transition-colors duration-200 ${
                    router.pathname === "/resources" ? "text-green-600" : ""
                  }`}
                >
                  Resources
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by Address / Txn Hash / Block / Token"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-full transition-all duration-300 text-sm"
                />
                <AnimatePresence>
                  {isSearching && (
                    <motion.div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
            <button
              className="md:hidden text-gray-600 hover:text-green-600 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="container mx-auto px-6 py-4 space-y-4">
                <Link
                  href="/explorer"
                  className="block text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  Explorer
                </Link>
                <Link
                  href="/transactions"
                  className="block text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  Transactions
                </Link>
                <Link
                  href="/tokens"
                  className="block text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  Tokens
                </Link>
                <Link
                  href="/resources"
                  className="block text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  Resources
                </Link>
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-full transition-all duration-300 text-sm"
                  />
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white shadow-sm rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <stat.icon className="w-6 h-6 text-green-500" />
                    <span className="text-2xl">{stat.symbol}</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-5 h-5 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{stat.info}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <h3 className="text-sm text-gray-500 mb-1">{stat.label}</h3>
                <p className="text-xl font-semibold text-gray-700">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white shadow-sm mb-8 rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-md">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="text-2xl font-light text-gray-700">
              Latest Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600">User</TableHead>
                    <TableHead className="text-gray-600">
                      Amount (BML)
                    </TableHead>
                    <TableHead className="text-gray-600">Timestamp</TableHead>
                    <TableHead className="text-gray-600">Datasets</TableHead>
                    <TableHead className="text-gray-600">Chain</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={tx.avatar} alt={tx.user} />
                            <AvatarFallback>
                              {tx.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{tx.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 rounded-full px-2 py-1"
                        >
                          +{tx.amount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {tx.timestamp}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{tx.datasets}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <ul className="list-disc pl-4">
                                  {tx.datasetNames.map((name, i) => (
                                    <li key={i}>{name}</li>
                                  ))}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{tx.chain}</span>
                          <Badge variant="secondary" className="text-xs">
                            {tx.chainSymbol}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-6 text-right">
              <Button
                variant="outline"
                className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors duration-200 rounded-full"
              >
                View all transactions
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-md">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="text-2xl font-light text-gray-700">
              Decentralization Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-600">
                  Progress
                </span>
                <span className="text-lg font-medium text-green-600">75%</span>
              </div>
              <Progress
                value={75}
                className="h-3 rounded-full bg-gray-100"
                // @ts-expect-error: i dont know
                indicatorClass="bg-green-500"
              />
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                BlockchainML is 75% decentralized. The network is continuously
                working towards full decentralization, ensuring a more robust
                and distributed system for all users.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                BlockchainML
              </h3>
              <p className="text-sm text-gray-600">
                Empowering decentralized machine learning through blockchain
                technology.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/explorer"
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    Explorer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/transactions"
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    Transactions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tokens"
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    Tokens
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/documentation"
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api"
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    API
                  </Link>
                </li>
                <li>
                  <Link
                    href="/whitepaper"
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    Whitepaper
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-4">
                Connect
              </h4>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  <IconBrandGithub size={24} />
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  <IconBrandTwitter size={24} />
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  <IconBrandDiscord size={24} />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              &copy; 2023 BlockchainML Explorer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}