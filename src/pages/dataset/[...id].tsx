// pages/dataset/[...id].tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import DatasetProfile from "@/components/DatasetProfile";
import FuturisticErrorPage from "@/components/ui/errorpage";
import { Dataset } from "@/types/dataset";
import React from "react";

const FuturisticLoadingScreen = dynamic(
  () => import("@/components/ui/loadingscreen"),
  {
    ssr: false,
  }
);

export default function DatasetDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [allDatasets, setAllDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDataset() {
      if (id) {
        try {
          const datasetId = Array.isArray(id) ? id.join("/") : id;
          const response = await fetch(`/api/dataset/${datasetId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch dataset");
          }
          const data = await response.json();
          setDataset(data);

          // Fetch all datasets
          const allDatasetsResponse = await fetch("/api/datasets");
          if (allDatasetsResponse.ok) {
            const allDatasetsData = await allDatasetsResponse.json();
            setAllDatasets(allDatasetsData);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchDataset();
  }, [id]);

  if (isLoading) {
    return (
      <div>
        <FuturisticLoadingScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <FuturisticErrorPage />
      </div>
    );
  }

  if (!dataset) {
    return <FuturisticErrorPage />;
  }

  return <DatasetProfile dataset={dataset} allDatasets={allDatasets} />;
}
