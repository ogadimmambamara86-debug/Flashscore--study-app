// controllers/News.ts
import { Request, Response } from "express";

// Define the shape of a News item
interface NewsItem {
  id: string;
  title: string;
  content: string;
  publishDate: Date;
  category: string;
}

export class NewsController {
  /**
   * GET /news
   * Fetch all news items
   */
  static async getAllNews(req: Request, res: Response): Promise<void> {
    try {
      const news: NewsItem[] = await fetchNewsFromAPI();

      res.status(200).json({
        success: true,
        data: news,
        count: news.length,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to fetch news",
        });
      }
    }
  }

  /**
   * GET /news/:id
   * Fetch single news item by ID
   */
  static async getNewsById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const newsItem = await fetchNewsById(id);

      if (!newsItem) {
        res.status(404).json({
          success: false,
          error: "News item not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: newsItem,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to fetch news item",
        });
      }
    }
  }
}

/**
 * Placeholder functions - replace with your actual implementation
 * e.g., call an external API, query MongoDB/Postgres, etc.
 */
async function fetchNewsFromAPI(): Promise<NewsItem[]> {
  // Example mock data for now
  return [
    {
      id: "1",
      title: "Breaking News Example",
      content: "This is a sample news content.",
      publishDate: new Date(),
      category: "General",
    },
  ];
}

async function fetchNewsById(id: string): Promise<NewsItem | null> {
  const allNews = await fetchNewsFromAPI();
  return allNews.find((item) => item.id === id) || null;
}