"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "../components/component/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Save, ArrowLeft } from "lucide-react";

export default function CreateModelPage() {
  const router = useRouter();
  const [modelName, setModelName] = useState("");
  const [description, setDescription] = useState("");
  const [task, setTask] = useState("");
  const [architecture, setArchitecture] = useState("");
  const [modelSize, setModelSize] = useState("");
  const [framework, setFramework] = useState("");
  const [license, setLicense] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({
      modelName,
      description,
      task,
      architecture,
      modelSize,
      framework,
      license,
      isPremium,
    });
    // After successful submission, redirect to the models page
    router.push("/models");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-800 font-sans">
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50 shadow-sm">
        <NavBar />
      </header>

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-800"
          onClick={() => router.push("/models")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Models
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-light flex items-center text-gray-700">
              <BrainCircuit className="mr-2" /> Create New AI Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="modelName">Model Name</Label>
                <Input
                  id="modelName"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  required
                  className="w-full border-gray-300 focus:border-green-300 focus:ring-green-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full border-gray-300 focus:border-green-300 focus:ring-green-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task">Task</Label>
                <Select value={task} onValueChange={setTask}>
                  <SelectTrigger className="w-full border-gray-300 focus:border-green-300 focus:ring-green-200">
                    <SelectValue placeholder="Select a task" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-generation">
                      Text Generation
                    </SelectItem>
                    <SelectItem value="image-classification">
                      Image Classification
                    </SelectItem>
                    <SelectItem value="object-detection">
                      Object Detection
                    </SelectItem>
                    <SelectItem value="sentiment-analysis">
                      Sentiment Analysis
                    </SelectItem>
                    <SelectItem value="translation">Translation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="architecture">Architecture</Label>
                <Input
                  id="architecture"
                  value={architecture}
                  onChange={(e) => setArchitecture(e.target.value)}
                  className="w-full border-gray-300 focus:border-green-300 focus:ring-green-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelSize">Model Size</Label>
                <Select value={modelSize} onValueChange={setModelSize}>
                  <SelectTrigger className="w-full border-gray-300 focus:border-green-300 focus:ring-green-200">
                    <SelectValue placeholder="Select model size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">
                      Small (&lt;100M parameters)
                    </SelectItem>
                    <SelectItem value="medium">
                      Medium (100M-1B parameters)
                    </SelectItem>
                    <SelectItem value="large">
                      Large (1B-10B parameters)
                    </SelectItem>
                    <SelectItem value="very-large">
                      Very Large (&gt;10B parameters)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="framework">Framework</Label>
                <Select value={framework} onValueChange={setFramework}>
                  <SelectTrigger className="w-full border-gray-300 focus:border-green-300 focus:ring-green-200">
                    <SelectValue placeholder="Select a framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pytorch">PyTorch</SelectItem>
                    <SelectItem value="tensorflow">TensorFlow</SelectItem>
                    <SelectItem value="jax">JAX</SelectItem>
                    <SelectItem value="keras">Keras</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="license">License</Label>
                <Select value={license} onValueChange={setLicense}>
                  <SelectTrigger className="w-full border-gray-300 focus:border-green-300 focus:ring-green-200">
                    <SelectValue placeholder="Select a license" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mit">MIT</SelectItem>
                    <SelectItem value="apache-2.0">Apache 2.0</SelectItem>
                    <SelectItem value="gpl-3.0">GPL 3.0</SelectItem>
                    <SelectItem value="proprietary">Proprietary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="premium"
                  checked={isPremium}
                  onCheckedChange={setIsPremium}
                />
                <Label htmlFor="premium">Premium Model</Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
              >
                <Save className="mr-2 h-4 w-4" /> Create Model
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
