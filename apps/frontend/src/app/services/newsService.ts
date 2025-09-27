
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface NewsAuthor {
  id: string;
  name: string;
  icon: string;
  bio?: string;
  expertise: string[];
  collaborationCount: number;
}

export interface NewsItem {
  id: number;
  title: string;
  preview: string;
  fullContent: string;
  author: NewsAuthor;
  collaborationType?: 'prediction' | 'analysis' | 'community' | 'update';
  createdAt: string;
  updatedAt: string;
  tags: string[];
  imageUrl?: string;
  viewCount: number;
  isPreview?: boolean;
  memberAccess?: {
    required: boolean;
    message: string;
  };
}

export interface NewsResponse {
  success: boolean;
  data: NewsItem[];
  count: number;
  accessLevel: 'guest' | 'member';
  memberBenefits?: {
    message: string;
    features: string[];
  };
}

export class NewsService {
  private static getAuthHeaders() {
    // In a real app, get this from session/localStorage
    const isLoggedIn = localStorage.getItem('memberAccess') === 'true';
    return isLoggedIn ? { 'Authorization': 'Bearer member' } : {};
  }

  static async getAllNews(): Promise<NewsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news`, {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      // Return fallback data if API fails
      return {
        success: true,
        data: [
          {
            id: 1,
            title: "Welcome to Sports Central",
            preview: "Your premier destination for sports news and predictions...",
            fullContent: "Welcome to Sports Central, your premier destination for sports news, expert predictions, and community discussions. Stay updated with the latest happenings in the world of sports.",
            author: {
              id: 'sports_central',
              name: 'Sports Central Team',
              icon: '🏆',
              bio: 'Official Sports Central editorial team',
              expertise: ['sports', 'news', 'predictions'],
              collaborationCount: 1
            },
            collaborationType: 'update',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ["welcome", "sports"],
            viewCount: 0
          }
        ],
        count: 1,
        accessLevel: 'guest'
      };
    }
  }

  static async getNewsById(id: number): Promise<{ success: boolean; data: NewsItem; accessLevel: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching news item:', error);
      throw error;
    }
  }

  static async createNews(newsData: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): Promise<NewsItem> {
    const response = await fetch(`${API_BASE_URL}/api/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
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
        ...this.getAuthHeaders()
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
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      }
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete news');
    }
  }
}
