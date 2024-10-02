import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NavBar } from "@/components/component/nav-bar";

interface Dataset {
  id: string;
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  fileKey: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
}

export default function DatasetPage() {
  const router = useRouter();
  const { id } = router.query;
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDataset();
    }
  }, [id]);

  const fetchDataset = async () => {
    try {
      const response = await fetch(`/api/datasets/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dataset");
      }
      const data = await response.json();
      setDataset(data);
    } catch (err) {
      setError("Error fetching dataset");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!dataset) return <div>Dataset not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-sm rounded-lg p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-light mb-6 text-gray-700">
            {dataset.title}
          </h1>
          <p className="text-gray-600 mb-4">{dataset.description}</p>
          <div className="mb-4">
            <strong>Tags:</strong> {dataset.tags.join(", ")}
          </div>
          <div className="mb-4">
            <strong>File Type:</strong> {dataset.fileType}
          </div>
          <div className="mb-4">
            <strong>Created:</strong>{" "}
            {new Date(dataset.createdAt).toLocaleString()}
          </div>
          <div className="mb-4">
            <strong>Updated:</strong>{" "}
            {new Date(dataset.updatedAt).toLocaleString()}
          </div>
          <div className="mb-4">
            <strong>Public:</strong> {dataset.isPublic ? "Yes" : "No"}
          </div>
          <button
            onClick={() =>
              window.open(`/api/datasets/${dataset.id}/download`, "_blank")
            }
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Download Dataset
          </button>
        </div>
      </div>
    </div>
  );
}
