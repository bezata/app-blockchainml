// pages/dataset/[...id].tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DatasetProfile from "@/components/DatasetProfile";
import { Dataset } from "@/types/dataset";

export default function DatasetProfilePage() {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchDataset() {
      if (!id) return;

      const datasetId = Array.isArray(id) ? id.join("/") : id;

      try {
        const response = await fetch(`/api/dataset/${datasetId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch dataset");
        }
        const data = await response.json();
        setDataset(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDataset();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        Loading dataset...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        Error: {error}
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        Dataset not found
      </div>
    );
  }

  return <DatasetProfile dataset={dataset} />;
}
