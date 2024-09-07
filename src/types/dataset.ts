// types/dataset.ts

export interface Dataset {
  _id: string;
  id: string;
  author: string;
  cardData: {
    pretty_name: string;
    annotations_creators: string[];
    language_creators: string[];
    language: string[];
    license: string[];
    multilinguality: string[];
    size_categories: string[];
    source_datasets: string[];
    task_categories: string[];
    task_ids: string[];
    paperswithcode_id: string;
    tags: string[];
    dataset_info: {
      features: Array<{
        name: string;
        dtype: string;
      }>;
      splits: Array<{
        name: string;
        num_bytes: number;
        num_examples: number;
      }>;
      download_size: number;
      dataset_size: number;
    };
  };
  disabled: boolean;
  gated: boolean;
  lastModified: string;
  likes: number;
  private: boolean;
  sha: string;
  description: string;
  downloads: number;
  tags: string[];
  createdAt: string;
}
