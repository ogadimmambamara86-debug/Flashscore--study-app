import { NewsAuthor, NewsItem } from './newsService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class NewsAuthorService {
  // Get all active authors
  static async getAllAuthors(): Promise<NewsAuthor[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news-authors`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch authors');
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      // Return fallback authors
      return [
        {
          id: 'mara',
          name: 'Mara',
          icon: '⚡',
          bio: 'Sports analytics expert specializing in predictive modeling and community insights',
          expertise: ['analytics', 'predictions', 'community'],
          collaborationCount: 15
        },
        {
          id: 'alex_sports',
          name: 'Alex Sports',
          icon: '⚽',
          bio: 'Football analyst with deep knowledge of team dynamics and player performance',
          expertise: ['football', 'analysis', 'tactics'],
          collaborationCount: 8
        },
        {
          id: 'sarah_stats',
          name: 'Sarah Stats',
          icon: '📊',
          bio: 'Data scientist focused on sports statistics and performance metrics',
          expertise: ['statistics', 'data', 'performance'],
          collaborationCount: 12
        }
      ];
    }
  }

  // Get author by ID
  static async getAuthorById(authorId: string): Promise<NewsAuthor | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news-authors/${authorId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching author:', error);
      return null;
    }
  }

  // Create or update author
  static async createOrUpdateAuthor(authorData: {
    id: string;
    name: string;
    icon: string;
    bio?: string;
    expertise?: string[];
  }): Promise<NewsAuthor> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news-authors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authorData),
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create/update author');
      }
    } catch (error) {
      console.error('Error creating/updating author:', error);
      throw error;
    }
  }

  // Create collaboration news
  static async createCollaborationNews(authorId: string, collaborationData: {
    title: string;
    preview: string;
    fullContent: string;
    collaborationType: 'prediction' | 'analysis' | 'community' | 'update';
    tags?: string[];
  }): Promise<NewsItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news-authors/${authorId}/collaborate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collaborationData),
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create collaboration news');
      }
    } catch (error) {
      console.error('Error creating collaboration news:', error);
      throw error;
    }
  }

  // Generate automatic news
  static async generateAutoNews(authorId: string, eventType: string, eventData: any): Promise<NewsItem | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news-authors/auto-news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorId,
          eventType,
          eventData
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error generating auto news:', error);
      return null;
    }
  }

  // Initialize default authors
  static async initializeDefaultAuthors(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news-authors/initialize`, {
        method: 'POST',
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to initialize default authors');
      }
    } catch (error) {
      console.error('Error initializing default authors:', error);
      throw error;
    }
  }

  // Simulate auto news generation for demo purposes
  static async simulateMaraCollaboration(): Promise<NewsItem | null> {
    const eventData = {
      matchName: 'Liverpool vs Arsenal',
      prediction: 'Liverpool Win',
      confidence: 85
    };

    return await this.generateAutoNews('mara', 'prediction_success', eventData);
  }

  // Create news for a milestone
  static async celebrateMilestone(authorId: string, milestone: number): Promise<NewsItem | null> {
    const eventData = {
      milestone: milestone
    };

    return await this.generateAutoNews(authorId, 'community_milestone', eventData);
  }

  // Create analysis update news
  static async shareAnalysis(authorId: string, topic: string): Promise<NewsItem | null> {
    const eventData = {
      topic: topic
    };

    return await this.generateAutoNews(authorId, 'analysis_update', eventData);
  }
}