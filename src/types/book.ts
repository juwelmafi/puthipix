export type AccessType = "free" | "public-domain";

export interface Book {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  author: string;
  translator?: string;
  description: string;
  synopsis?: string[];
  coverImage: string;
  pdfUrl?: string;
  price?: number;
  accessType?: AccessType;
  publishedYear: number;
  edition?: string;
  pageCount: number;
  language: string;
  genre: string;
  genreSlug: string;
  category: string;
  categorySlug: string;
  featured?: boolean;
  recentlyAdded?: boolean;
  rating?: number;
  publisher?: string;
  tableOfContents?: string[];
  publicDomain?: boolean;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  count: number;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
