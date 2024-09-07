import { useState, useEffect } from "react";
import DatasetsList from "@/components/DatasetsList";
import dynamic from "next/dynamic";
import FuturisticErrorPage from "@/components/ui/errorpage";

const FuturisticLoadingScreen = dynamic(
  () => import("@/components/ui/loadingscreen"),
  { ssr: false }
);

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

  return <DatasetsList datasets={datasets} />;
}
