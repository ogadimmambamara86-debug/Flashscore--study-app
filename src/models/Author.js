
class Author {
  constructor(id, name, email, bio, expertise, isActive = true) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.bio = bio;
    this.expertise = expertise; // Array of sports/areas of expertise
    this.isActive = isActive;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Static method to create author from data
  static fromData(data) {
    return new Author(
      data.id,
      data.name,
      data.email,
      data.bio,
      data.expertise,
      data.isActive
    );
  }

  // Method to update author info
  update(updateData) {
    Object.keys(updateData).forEach(key => {
      if (this.hasOwnProperty(key) && key !== 'id' && key !== 'createdAt') {
        this[key] = updateData[key];
      }
    });
    this.updatedAt = new Date();
  }

  // Method to get author's active predictions
  getActivePredictions(predictions) {
    return predictions.filter(prediction => 
      prediction.authorId === this.id && prediction.isActive
    );
  }

  // Method to validate author data
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Valid email is required');
    }
    
    if (!this.expertise || !Array.isArray(this.expertise) || this.expertise.length === 0) {
      errors.push('At least one area of expertise is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper method to validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Method to format author for display
  toDisplay() {
    return {
      id: this.id,
      name: this.name,
      bio: this.bio,
      expertise: this.expertise,
      isActive: this.isActive
    };
  }
}

module.exports = Author;
