import { useState, useEffect } from "react";
import DatasetsList from "@/components/DatasetsList";

export default function Datasets() {
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const response = await fetch("/api/datasets");
        if (!response.ok) {
          throw new Error("Failed to fetch datasets");
        }
        const data = await response.json();
        setDatasets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchDatasets();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        Loading datasets...
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

  return <DatasetsList datasets={datasets} />;
}
