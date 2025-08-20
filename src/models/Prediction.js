
class Prediction {
  constructor(id, title, content, authorId, sport, matchDetails, confidence, status = 'pending') {
    this.id = id;
    this.title = title;
    this.content = content;
    this.authorId = authorId;
    this.sport = sport;
    this.matchDetails = matchDetails; // Object with home, away, date, etc.
    this.confidence = confidence; // Percentage (0-100)
    this.status = status; // pending, active, completed, cancelled
    this.result = null; // win, loss, draw (set after match completion)
    this.isActive = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.publishedAt = null;
  }

  // Static method to create prediction from data
  static fromData(data) {
    const prediction = new Prediction(
      data.id,
      data.title,
      data.content,
      data.authorId,
      data.sport,
      data.matchDetails,
      data.confidence,
      data.status
    );
    
    if (data.result) prediction.result = data.result;
    if (data.publishedAt) prediction.publishedAt = new Date(data.publishedAt);
    if (data.createdAt) prediction.createdAt = new Date(data.createdAt);
    if (data.updatedAt) prediction.updatedAt = new Date(data.updatedAt);
    
    return prediction;
  }

  // Method to update prediction
  update(updateData) {
    Object.keys(updateData).forEach(key => {
      if (this.hasOwnProperty(key) && key !== 'id' && key !== 'createdAt') {
        this[key] = updateData[key];
      }
    });
    this.updatedAt = new Date();
  }

  // Method to publish prediction
  publish() {
    this.status = 'active';
    this.publishedAt = new Date();
    this.updatedAt = new Date();
  }

  // Method to complete prediction with result
  complete(result) {
    if (['win', 'loss', 'draw'].includes(result)) {
      this.result = result;
      this.status = 'completed';
      this.updatedAt = new Date();
    }
  }

  // Method to validate prediction data
  validate() {
    const errors = [];
    
    if (!this.title || this.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters long');
    }
    
    if (!this.content || this.content.trim().length < 20) {
      errors.push('Content must be at least 20 characters long');
    }
    
    if (!this.authorId) {
      errors.push('Author ID is required');
    }
    
    if (!this.sport || this.sport.trim().length < 2) {
      errors.push('Sport is required');
    }
    
    if (!this.matchDetails || !this.matchDetails.home || !this.matchDetails.away) {
      errors.push('Match details with home and away teams are required');
    }
    
    if (this.confidence < 0 || this.confidence > 100) {
      errors.push('Confidence must be between 0 and 100');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Method to format prediction for API response
  toAPI() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      sport: this.sport,
      matchDetails: this.matchDetails,
      confidence: this.confidence,
      status: this.status,
      result: this.result,
      publishedAt: this.publishedAt,
      createdAt: this.createdAt
    };
  }

  // Method to format prediction for display
  toDisplay() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      sport: this.sport,
      match: `${this.matchDetails.home} vs ${this.matchDetails.away}`,
      confidence: `${this.confidence}%`,
      status: this.status,
      publishedAt: this.publishedAt ? this.publishedAt.toLocaleDateString() : null
    };
  }
}

module.exports = Prediction;
