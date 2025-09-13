
import { Request, Response } from 'express';
import News, { INews } from '../models/News';

export class NewsController {
  // Get all active news
  static async getAllNews(req: Request, res: Response): Promise<void> {
    try {
      const news = await News.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(20);
      
      res.json({
        success: true,
        data: news,
        count: news.length
      });
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch news',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get single news item
  static async getNewsById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const news = await News.findOne({ id: parseInt(id), isActive: true });
      
      if (!news) {
        res.status(404).json({
          success: false,
          message: 'News item not found'
        });
        return;
      }

      // Increment view count
      await News.findByIdAndUpdate(news._id, { $inc: { viewCount: 1 } });
      
      res.json({
        success: true,
        data: news
      });
    } catch (error) {
      console.error('Error fetching news by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch news item',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create new news item
  static async createNews(req: Request, res: Response): Promise<void> {
    try {
      const { title, preview, fullContent, author, tags, imageUrl } = req.body;
      
      // Get the next ID
      const lastNews = await News.findOne().sort({ id: -1 });
      const nextId = lastNews ? lastNews.id + 1 : 1;
      
      const news = new News({
        id: nextId,
        title,
        preview,
        fullContent,
        author: author || 'Admin',
        tags: tags || [],
        imageUrl
      });
      
      const savedNews = await news.save();
      
      res.status(201).json({
        success: true,
        data: savedNews,
        message: 'News created successfully'
      });
    } catch (error) {
      console.error('Error creating news:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to create news',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update news item
  static async updateNews(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const news = await News.findOneAndUpdate(
        { id: parseInt(id) },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!news) {
        res.status(404).json({
          success: false,
          message: 'News item not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: news,
        message: 'News updated successfully'
      });
    } catch (error) {
      console.error('Error updating news:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update news',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete news item (soft delete)
  static async deleteNews(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const news = await News.findOneAndUpdate(
        { id: parseInt(id) },
        { isActive: false },
        { new: true }
      );
      
      if (!news) {
        res.status(404).json({
          success: false,
          message: 'News item not found'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'News deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting news:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete news',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
