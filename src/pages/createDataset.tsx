"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Plus, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/component/nav-bar";
import Papa from "papaparse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TrendingUp, Users, DollarSign } from "lucide-react";
import {
  Music,
  FileText,
  FileType,
  Database,
  Image as ImageIcon,
  Film,
} from "lucide-react";

const API_BASE_URL = "http://localhost:4000/api/v1";

const tagSuggestions = [
  "Machine Learning",
  "Blockchain",
  "Data Science",
  "AI",
  "Big Data",
  "Analytics",
];

export default function CreateDataset() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [dataType, setDataType] = useState<string>("tabular");

  const dataTypes = [
    { value: "tabular", label: "Tabular Data", icon: Database },
    { value: "image", label: "Image", icon: ImageIcon },
    { value: "video", label: "Video", icon: Film },
    { value: "audio", label: "Audio", icon: Music },
    { value: "text", label: "Text", icon: FileText },
    { value: "other", label: "Other", icon: FileType },
  ];

  const [processingOptions, setProcessingOptions] = useState({
    videoFrameRate: 30,
    audioSampleRate: 44100,
    imageResolution: "original",
  });
  const router = useRouter();
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setUploadProgress(0);

    if (!title || !file || tags.length === 0) {
      setError("Please provide a title, at least one tag, and upload a file.");
      setIsLoading(false);
      return;
    }

    try {
      let fileData: string | object[] | object;
      const fileType = file.type;

      switch (fileType) {
        case "application/json":
        case "application/vnd.croissant+json":
          fileData = await parseJsonFile(file);
          break;
        case "text/csv":
          fileData = await parseCsvFile(file);
          break;
        case "application/x-parquet":
          fileData = await readFileAsBase64(file);
          break;
        default:
          fileData = await readFileAsBase64(file);
      }

      const payload = {
        title,
        description,
        tags,
        isPublic,
        file: {
          name: file.name,
          size: file.size,
          type: fileType,
          data: JSON.stringify(fileData), // Stringify all data before sending
        },
      };

      console.log("Payload being sent:", {
        ...payload,
        file: {
          ...payload.file,
          data:
            typeof payload.file.data === "string"
              ? payload.file.data.slice(0, 100) + "..."
              : "<<stringified data>>",
        },
      });

      const response = await fetch(`${API_BASE_URL}/datasets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const result = await response.json();
      console.log("Dataset created successfully:", result);
      router.push(`/datasets/${result.dataset.id}`);
    } catch (err) {
      console.error("Error details:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const parseJsonFile = async (file: File): Promise<object> => {
    const text = await readFileAsText(file);
    return JSON.parse(text);
  };

  const parseCsvFile = async (file: File): Promise<object[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          resolve(results.data as object[]);
        },
        header: true,
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]);
        } else {
          reject(new Error("Failed to read file as base64"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          resolve(event.target.result);
        } else {
          reject(new Error("Failed to read file as text"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Create New Dataset
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm rounded-lg p-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Dataset Title*</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter dataset title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your dataset"
                    className="h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataType">Data Type*</Label>
                  <Select value={dataType} onValueChange={setDataType}>
                    <SelectTrigger id="dataType">
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center">
                            <type.icon className="mr-2 h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {dataType === "video" && (
                  <div className="space-y-2">
                    <Label htmlFor="videoFrameRate">Video Frame Rate</Label>
                    <Input
                      id="videoFrameRate"
                      type="number"
                      value={processingOptions.videoFrameRate}
                      onChange={(e) =>
                        setProcessingOptions({
                          ...processingOptions,
                          videoFrameRate: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                )}

                {dataType === "audio" && (
                  <div className="space-y-2">
                    <Label htmlFor="audioSampleRate">Audio Sample Rate</Label>
                    <Input
                      id="audioSampleRate"
                      type="number"
                      value={processingOptions.audioSampleRate}
                      onChange={(e) =>
                        setProcessingOptions({
                          ...processingOptions,
                          audioSampleRate: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                )}

                {dataType === "image" && (
                  <div className="space-y-2">
                    <Label htmlFor="imageResolution">Image Resolution</Label>
                    <Select
                      value={processingOptions.imageResolution}
                      onValueChange={(value) =>
                        setProcessingOptions({
                          ...processingOptions,
                          imageResolution: value,
                        })
                      }
                    >
                      <SelectTrigger id="imageResolution">
                        <SelectValue placeholder="Select image resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original</SelectItem>
                        <SelectItem value="hd">HD (1280x720)</SelectItem>
                        <SelectItem value="fhd">Full HD (1920x1080)</SelectItem>
                        <SelectItem value="4k">4K (3840x2160)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags*</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tagSuggestions.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors duration-300"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <Input
                    id="tags"
                    placeholder="Add custom tags (press Enter)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          addTag(input.value.trim());
                          input.value = "";
                        }
                      }
                    }}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload Files*</Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors duration-300 ${
                      isDragActive
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <p className="text-gray-500">
                      <Upload className="inline mr-2" size={18} />
                      Drag & drop files here, or click to select
                    </p>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-100 p-2 rounded"
                        >
                          <span className="text-sm text-gray-600">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                  <Label htmlFor="public">Make dataset public</Label>
                </div>

                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label>Upload Progress</Label>
                      <Progress value={uploadProgress} className="w-full" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  className="w-full bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-300"
                  disabled={isLoading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Dataset"
                  )}
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm rounded-lg p-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Monetization Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-medium">Earn per Download</h3>
                    <p className="text-sm text-gray-500">
                      $0.05 - $0.50 per download
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Usage-based Earnings</h3>
                    <p className="text-sm text-gray-500">
                      Earn based on dataset usage in models
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div>
                    <h3 className="font-medium">Collaboration Bonus</h3>
                    <p className="text-sm text-gray-500">
                      Extra 10% for datasets with multiple contributors
                    </p>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Tips for Higher Earnings</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Ensure high data quality and accuracy</li>
                    <li>Provide detailed descriptions and metadata</li>
                    <li>Use relevant and popular tags</li>
                    <li>Create datasets in high-demand categories</li>
                    <li>Regularly update and maintain your datasets</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}