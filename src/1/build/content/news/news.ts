import { z } from 'zod';
import fs from 'fs/promises';

// News item schema
const NewsItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  category: z.string(),
  image: z.string().optional(),
  url: z.string(),
});

// News data schema
const NewsDataSchema = z.object({
  items: z.array(NewsItemSchema),
});

// Types
type NewsItem = z.infer<typeof NewsItemSchema>;
type NewsData = z.infer<typeof NewsDataSchema>;

interface PaginatedResult {
  items: NewsItem[];
  totalPages: number;
  currentPage: number;
  total: number;
}

interface FilterOptions {
  category?: string;
  search?: string;
}

export class NewsManager {
  private filePath: string;
  private newsData: NewsData | null = null;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  // Load news data
  private async loadNews(): Promise<NewsData> {
    if (this.newsData) return this.newsData;

    try {
      const fileContent = await fs.readFile(this.filePath, 'utf-8');
      const data = yaml.load(fileContent) as unknown;
      this.newsData = NewsDataSchema.parse(data);
      return this.newsData;
    } catch (error) {
      console.error('Error loading news data:', error);
      throw new Error('Failed to load news data');
    }
  }

  // Get all categories
  async getCategories(): Promise<string[]> {
    const data = await this.loadNews();
    const categories = new Set(data.items.map(item => item.category));
    return Array.from(categories);
  }

  // Filter news items
  private filterNews(items: NewsItem[], options: FilterOptions): NewsItem[] {
    let filtered = [...items];

    if (options.category) {
      filtered = filtered.filter(item => item.category === options.category);
    }

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }

  // Get paginated news
  async getPaginatedNews(
    page: number = 1,
    itemsPerPage: number = 6,
    options: FilterOptions = {}
  ): Promise<PaginatedResult> {
    const data = await this.loadNews();
    const filtered = this.filterNews(data.items, options);
    const total = filtered.length;
    const totalPages = Math.ceil(total / itemsPerPage);
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return {
      items: filtered.slice(start, end),
      totalPages,
      currentPage,
      total,
    };
  }

  // Search news
  async searchNews(query: string): Promise<NewsItem[]> {
    const data = await this.loadNews();
    const searchLower = query.toLowerCase();
    
    return data.items.filter(item =>
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower)
    );
  }

  // Get news by category
  async getNewsByCategory(category: string): Promise<NewsItem[]> {
    const data = await this.loadNews();
    return data.items.filter(item => item.category === category);
  }
} 