'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { AlertTriangle } from "lucide-react"
import { useRouter } from 'next/router'

export default function CreateModel() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [dataset, setDataset] = useState('')
  const [epochs, setEpochs] = useState(100)
  const [learningRate, setLearningRate] = useState(0.001)
  const [isPublic, setIsPublic] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name || !description || !type || !dataset) {
      setError('Please fill in all required fields.')
      return
    }

    // Here you would typically send the data to your backend
    console.log({ name, description, type, dataset, epochs, learningRate, isPublic })
    // Reset form or redirect user after successful submission
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      
      <button className="text-2xl font-bold text-white mb-6" onClick={() => router.push('/create-model')}>Create New Model</button>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-white">Model Name</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-white">Description</Label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label htmlFor="type" className="text-white">Model Type</Label>
          <Select onValueChange={setType}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lstm">LSTM</SelectItem>
              <SelectItem value="random_forest">Random Forest</SelectItem>
              <SelectItem value="gradient_boosting">Gradient Boosting</SelectItem>
              <SelectItem value="cnn">CNN</SelectItem>
              <SelectItem value="bert">BERT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dataset" className="text-white">Dataset</Label>
          <Select onValueChange={setDataset}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select dataset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="btc_price">BTC Price History</SelectItem>
              <SelectItem value="eth_gas">ETH Gas Prices</SelectItem>
              <SelectItem value="defi_transactions">DeFi Transactions</SelectItem>
              <SelectItem value="nft_sales">NFT Sales Data</SelectItem>
              <SelectItem value="crypto_sentiment">Crypto Social Media Sentiment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="epochs" className="text-white">Number of Epochs</Label>
          <Slider
            id="epochs"
            min={10}
            max={1000}
            step={10}
            value={[epochs]}
            onValueChange={(value) => setEpochs(value[0])}
            className="py-4"
          />
          <div className="text-gray-400 text-sm">{epochs}</div>
        </div>

        <div>
          <Label htmlFor="learningRate" className="text-white">Learning Rate</Label>
          <Slider
            id="learningRate"
            min={0.0001}
            max={0.1}
            step={0.0001}
            value={[learningRate]}
            onValueChange={(value) => setLearningRate(value[0])}
            className="py-4"
          />
          <div className="text-gray-400 text-sm">{learningRate.toFixed(4)}</div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id="public" 
            checked={isPublic} 
            onCheckedChange={setIsPublic}
          />
          <Label htmlFor="public" className="text-white">Make model public</Label>
        </div>

        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Create Model
        </Button>
      </form>
    </div>
  )
}