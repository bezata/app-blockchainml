// pages/dataset/[...id].tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DatasetProfile, {
  Dataset as ComponentDataset,
} from "@/components/DatasetProfile";
import { Dataset as ApiDataset } from "@/types/dataset";
import FuturisticLoadingScreen from "@/components/ui/loadingscreen";
import ErrorPage from "@/components/ui/errorpage";

export default function DatasetProfilePage() {
  const [dataset, setDataset] = useState<ApiDataset | null>(null);
  const [allDatasets, setAllDatasets] = useState<ApiDataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const datasetId = Array.isArray(id) ? id.join("/") : id;

      try {
        // Fetch the specific dataset
        const datasetResponse = await fetch(`/api/dataset/${datasetId}`);
        if (!datasetResponse.ok) {
          throw new Error("Failed to fetch dataset");
        }
        const datasetData = await datasetResponse.json();
        setDataset(datasetData);

        // Fetch all datasets
        const allDatasetsResponse = await fetch("/api/datasets");
        if (!allDatasetsResponse.ok) {
          throw new Error("Failed to fetch all datasets");
        }
        const allDatasetsData = await allDatasetsResponse.json();
        setAllDatasets(allDatasetsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (isLoading) {
    return <FuturisticLoadingScreen />;
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        Error: {error}
      </div>
    );
  }

  if (!dataset) {
    return <ErrorPage />;
  }

  return (
    <DatasetProfile
      dataset={dataset as unknown as ComponentDataset}
      allDatasets={allDatasets as unknown as ComponentDataset[]}
    />
  );
}