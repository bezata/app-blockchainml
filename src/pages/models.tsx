'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Play, Pause, RotateCcw, Settings } from "lucide-react"

export default function Models() {
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Models</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create New Model
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">18</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg. Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">87.5%</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
            placeholder="Search models"
            type="search"
          />
        </div>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          Filter
        </Button>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          Sort
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-300">Name</TableHead>
            <TableHead className="text-gray-300">Type</TableHead>
            <TableHead className="text-gray-300">Accuracy</TableHead>
            <TableHead className="text-gray-300">Last Run</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id} className="border-gray-700">
              <TableCell className="font-medium text-white">{model.name}</TableCell>
              <TableCell className="text-gray-300">{model.type}</TableCell>
              <TableCell className="text-gray-300">{model.accuracy}</TableCell>
              <TableCell className="text-gray-300">{model.lastRun}</TableCell>
              <TableCell>
                <Badge 
                  variant={model.status === 'Active' ? 'default' : 'secondary'}
                  className={model.status === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}
                >
                  {model.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900">
                    {model.status === 'Active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-green-900">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const models = [
  { id: 1, name: 'BTC Price Predictor', type: 'LSTM', accuracy: '89%', lastRun: '2023-06-15', status: 'Active' },
  { id: 2, name: 'ETH Gas Estimator', type: 'Random Forest', accuracy: '92%', lastRun: '2023-06-14', status: 'Active' },
  { id: 3, name: 'DeFi Risk Analyzer', type: 'Gradient Boosting', accuracy: '87%', lastRun: '2023-06-13', status: 'Inactive' },
  { id: 4, name: 'NFT Trend Predictor', type: 'CNN', accuracy: '85%', lastRun: '2023-06-12', status: 'Active' },
  { id: 5, name: 'Crypto Sentiment Analyzer', type: 'BERT', accuracy: '91%', lastRun: '2023-06-11', status: 'Active' },
]