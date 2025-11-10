export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  badge?: 'new' | 'bestseller' | 'trending';
  stock: number;
  category: string;
}

export interface TrendingSearch {
  term: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RecentSearch {
  term: string;
  timestamp: number;
  resultsCount: number;
}

export interface SearchAnalytics {
  term: string;
  searchCount: number;
  resultsFound: number;
  clickThrough: number;
  lastSearched: Date;
}

export interface SaveSearchPayload {
  term: string;
  resultsCount: number;
  userId?: string;
}
