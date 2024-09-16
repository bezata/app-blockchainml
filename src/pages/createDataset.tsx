"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Upload, X, Tag } from "lucide-react";
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
  const router = useRouter();

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
      const fileData = await readFileAsBase64(file);

      const payload = {
        title,
        description,
        tags,
        isPublic,
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          data: fileData,
        },
      };

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
        <div className="bg-white shadow-sm rounded-lg p-8 max-w-2xl mx-auto transition-all duration-300 hover:shadow-md">
          <h1 className="text-3xl font-light mb-6 text-gray-700">
            Create New Dataset
          </h1>

          {error && (
            <Alert
              variant="destructive"
              className="mb-6 bg-red-50 border-red-200 text-red-700"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-600">
                Dataset Title*
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter dataset title"
                required
                className="bg-gray-50 text-gray-800 border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-md transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-600">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your dataset"
                className="h-32 bg-gray-50 text-gray-800 border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-md transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-gray-600">
                Tags*
              </Label>
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
                className="mt-2 bg-gray-50 text-gray-800 border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-md transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file" className="text-gray-600">
                Upload File*
              </Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors duration-300 ${
                  isDragActive
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-green-400"
                }`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <p className="text-gray-700">
                    <Tag className="inline mr-2" size={18} />
                    {file.name}
                  </p>
                ) : (
                  <p className="text-gray-500">
                    <Upload className="inline mr-2" size={18} />
                    Drag & drop a file here, or click to select
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                className="data-[state=checked]:bg-green-500"
              />
              <Label htmlFor="public" className="text-gray-600">
                Make dataset public
              </Label>
            </div>

            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label className="text-gray-600">Upload Progress</Label>
                  <Progress value={uploadProgress} className="w-full" />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-300"
              disabled={isLoading}
            >
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
        </div>
      </div>
    </div>
  );
}
