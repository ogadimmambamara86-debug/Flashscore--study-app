
const Author = require('../models/Author');

class AuthorController {
  constructor() {
    this.authors = [];
    this.nextId = 1;
    this.initializeSampleData();
  }

  // Initialize sample data
  initializeSampleData() {
    const sampleAuthors = [
      new Author(this.nextId++, 'John Sports', 'john@sportsanalyst.com', 'Expert football analyst with 10 years experience', ['Football', 'Soccer']),
      new Author(this.nextId++, 'Sarah Basketball', 'sarah@hoopsexpert.com', 'Former professional basketball player turned analyst', ['Basketball']),
      new Author(this.nextId++, 'Mike Tennis', 'mike@tennispro.com', 'Tennis coach and prediction specialist', ['Tennis']),
      new Author(this.nextId++, 'Alex Soccer', 'alex@soccerpro.com', 'International soccer analyst and former player', ['Soccer', 'Football'])
    ];
    
    this.authors = sampleAuthors;
  }

  // Get all authors
  getAllAuthors() {
    try {
      return this.authors
        .filter(author => author.isActive)
        .map(author => author.toDisplay());
    } catch (error) {
      throw new Error(`Error fetching authors: ${error.message}`);
    }
  }

  // Get author by ID
  getAuthorById(id) {
    try {
      const author = this.authors.find(a => a.id === parseInt(id));
      if (!author) {
        throw new Error('Author not found');
      }
      return author.toDisplay();
    } catch (error) {
      throw new Error(`Error fetching author: ${error.message}`);
    }
  }

  // Create new author
  createAuthor(authorData) {
    try {
      const author = new Author(
        this.nextId++,
        authorData.name,
        authorData.email,
        authorData.bio,
        authorData.expertise
      );

      const validation = author.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Check if email already exists
      const existingAuthor = this.authors.find(a => a.email === author.email && a.isActive);
      if (existingAuthor) {
        throw new Error('Author with this email already exists');
      }

      this.authors.push(author);
      return author.toDisplay();
    } catch (error) {
      throw new Error(`Error creating author: ${error.message}`);
    }
  }

  // Update author
  updateAuthor(id, updateData) {
    try {
      const author = this.authors.find(a => a.id === parseInt(id));
      if (!author) {
        throw new Error('Author not found');
      }

      // If email is being updated, check for duplicates
      if (updateData.email && updateData.email !== author.email) {
        const existingAuthor = this.authors.find(a => a.email === updateData.email && a.isActive && a.id !== author.id);
        if (existingAuthor) {
          throw new Error('Another author with this email already exists');
        }
      }

      author.update(updateData);
      
      const validation = author.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      return author.toDisplay();
    } catch (error) {
      throw new Error(`Error updating author: ${error.message}`);
    }
  }

  // Delete author (soft delete)
  deleteAuthor(id) {
    try {
      const author = this.authors.find(a => a.id === parseInt(id));
      if (!author) {
        throw new Error('Author not found');
      }

      author.isActive = false;
      author.updatedAt = new Date();
      
      return { success: true, message: 'Author deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting author: ${error.message}`);
    }
  }

  // Get authors by expertise
  getAuthorsByExpertise(sport) {
    try {
      return this.authors
        .filter(author => 
          author.isActive && 
          author.expertise.some(exp => exp.toLowerCase() === sport.toLowerCase())
        )
        .map(author => author.toDisplay());
    } catch (error) {
      throw new Error(`Error fetching authors by expertise: ${error.message}`);
    }
  }

  // Search authors by name
  searchAuthors(searchTerm) {
    try {
      const term = searchTerm.toLowerCase();
      return this.authors
        .filter(author => 
          author.isActive && 
          author.name.toLowerCase().includes(term)
        )
        .map(author => author.toDisplay());
    } catch (error) {
      throw new Error(`Error searching authors: ${error.message}`);
    }
  }

  // Get author statistics
  getAuthorStats(id) {
    try {
      const author = this.authors.find(a => a.id === parseInt(id));
      if (!author) {
        throw new Error('Author not found');
      }

      // In a real app, this would query the predictions database
      // For now, return basic author info with placeholders
      return {
        ...author.toDisplay(),
        totalPredictions: 0,
        activePredictions: 0,
        winRate: '0%',
        averageConfidence: '0%'
      };
    } catch (error) {
      throw new Error(`Error fetching author statistics: ${error.message}`);
    }
  }
}

module.exports = AuthorController;
