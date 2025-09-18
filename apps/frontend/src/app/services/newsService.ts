
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface NewsItem {
  id: number;
  title: string;
  preview: string;
  fullContent: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  imageUrl?: string;
  viewCount: number;
}

export class NewsService {
  static async getAllNews(): Promise<NewsItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      // Return fallback data if API fails
      return [
        {
          id: 1,
          title: "Welcome to Sports Central",
          preview: "Your premier destination for sports news and predictions...",
          fullContent: "Welcome to Sports Central, your premier destination for sports news, expert predictions, and community discussions. Stay updated with the latest happenings in the world of sports.",
          author: "Sports Central Team",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ["welcome", "sports"],
          viewCount: 0
        }
      ];
    }
  }

  static async createNews(newsData: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): Promise<NewsItem> {
    const response = await fetch(`${API_BASE_URL}/api/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsData),
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to create news');
    }
  }

  static async updateNews(id: number, newsData: Partial<NewsItem>): Promise<NewsItem> {
    const response = await fetch(`${API_BASE_URL}/api/news/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsData),
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to update news');
    }
  }

  static async deleteNews(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/news/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete news');
    }
  }
}
