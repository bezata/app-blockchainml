// types/dataset.ts

export interface Dataset {
  _id: string;
  id: string;
  author: string;
  cardData: {
    pretty_name: string;
    task_categories: string[];
    size_categories: string[];
    license: string[];
    language: string[];
    paperswithcode_id: string;
    dataset_info: {
      config_name: string;
      splits: Split[];
      dataset_size: number;
      download_size: number;
    }[];
    configs: { config_name: string }[];
  };
  lastModified: string;
  downloads: number;
  tags: string[];
  description: string;
}

interface Split {
  name: string;
  num_examples: number;
}