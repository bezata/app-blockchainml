'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Download, Eye, Trash2 } from "lucide-react"
import { useRouter } from 'next/router'

export default function Datasets() {
  const router = useRouter()
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Datasets</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push('/create-dataset')}>
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
            <TableHead className="text-gray-300">Size</TableHead>
            <TableHead className="text-gray-300">Last Updated</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasets.map((dataset) => (
            <TableRow key={dataset.id} className="border-gray-700">
              <TableCell className="font-medium text-white">{dataset.name}</TableCell>
              <TableCell className="text-gray-300">{dataset.type}</TableCell>
              <TableCell className="text-gray-300">{dataset.size}</TableCell>
              <TableCell className="text-gray-300">{dataset.lastUpdated}</TableCell>
              <TableCell>
                <Badge 
                  variant={dataset.status === 'Active' ? 'default' : 'secondary'}
                  className={dataset.status === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}
                >
                  {dataset.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-green-900">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900">
                    <Trash2 className="h-4 w-4" />
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

const datasets = [
  { id: 1, name: 'Ethereum Transactions 2023', type: 'CSV', size: '1.2 GB', lastUpdated: '2023-06-15', status: 'Active' },
  { id: 2, name: 'Bitcoin Historical Prices', type: 'JSON', size: '500 MB', lastUpdated: '2023-06-10', status: 'Active' },
  { id: 3, name: 'DeFi Protocols Analysis', type: 'CSV', size: '750 MB', lastUpdated: '2023-06-05', status: 'Processing' },
  { id: 4, name: 'NFT Sales Data', type: 'JSON', size: '2.1 GB', lastUpdated: '2023-06-01', status: 'Active' },
  { id: 5, name: 'Crypto Exchange Order Books', type: 'CSV', size: '3.5 GB', lastUpdated: '2023-05-28', status: 'Archived' },
]