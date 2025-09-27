// Define the author interface locally to avoid import issues
interface AuthorData {
  id: string;
  name: string;
  icon: string;
  bio?: string;
  expertise: string[];
  collaborationCount: number;
}

// Helper function to normalize author data for backward compatibility
export function normalizeAuthor(author: any): AuthorData {
  if (typeof author === 'string') {
    // Convert legacy string author to new format
    return {
      id: author.toLowerCase().replace(/\s+/g, '_'),
      name: author,
      icon: '👤',
      bio: '',
      expertise: [],
      collaborationCount: 1
    } as AuthorData;
  }
  
  // Return as-is if already in new format
  return author as AuthorData;
}

// Helper function to create default authors
export function createDefaultAuthor(name: string, icon: string = '👤'): AuthorData {
  return {
    id: name.toLowerCase().replace(/\s+/g, '_'),
    name: name,
    icon: icon,
    bio: `${name} - Sports contributor`,
    expertise: ['sports', 'analysis'],
    collaborationCount: 1
  } as AuthorData;
}

// Helper function to migrate string authors to object format
export function migrateAuthorFormat(author: any): AuthorData {
  if (typeof author === 'string') {
    switch (author.toLowerCase()) {
      case 'mara':
        return {
          id: 'mara',
          name: 'Mara',
          icon: '⚡',
          bio: 'Sports analytics expert specializing in predictive modeling and community insights',
          expertise: ['analytics', 'predictions', 'community'],
          collaborationCount: 1
        } as AuthorData;
      case 'admin':
      case 'sports central team':
        return {
          id: 'sports_central',
          name: 'Sports Central Team',
          icon: '🏆',
          bio: 'Official Sports Central editorial team',
          expertise: ['sports', 'news', 'predictions'],
          collaborationCount: 1
        } as AuthorData;
      default:
        return createDefaultAuthor(author, '📝');
    }
  }
  
  return author as INewsAuthor;
}