import React, { useState, useEffect, useRef } from 'react';
import { useMobile } from '@hooks/useMobile';

interface SearchResult {
  id: string;
  type: 'article' | 'author' | 'prediction';
  title: string;
  content?: string;
  author?: string;
  sport?: string;
  confidence?: string;
  tags?: string[];
  publishDate?: string;
  winRate?: number;
  expertise?: string[];
  source?: string;
}

interface FilterOptions {
  type: 'all' | 'articles' | 'authors' | 'predictions';
  sport: string;
  dateRange: '24h' | '7d' | '30d' | 'all';
  sortBy: 'relevance' | 'date' | 'popularity' | 'confidence';
}

const SearchDirectory: React.FC = () => {
  const isMobile = useMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    sport: 'all',
    dateRange: 'all',
    sortBy: 'relevance'
  });
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Mock data - replace with actual API calls
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'article',
      title: 'Premier League Transfer Window Analysis',
      content: 'Comprehensive analysis of the latest transfer moves in the Premier League...',
      author: 'Sports Editor',
      tags: ['transfers', 'premier-league', 'analysis'],
      publishDate: '2024-01-15',
      source: 'internal'
    },
    {
      id: '2',
      type: 'author',
      title: 'John "The Rocket" Rodriguez',
      content: 'Former NFL quarterback turned elite sports analyst with 12+ years experience.',
      expertise: ['Football', 'Soccer', 'Basketball'],
      winRate: 85,
      source: 'internal'
    },
    {
      id: '3',
      type: 'prediction',
      title: 'Manchester United vs Liverpool - Home Win Expected',
      content: 'Manchester United shows strong form at home this season.',
      author: 'John Rodriguez',
      sport: 'Soccer',
      confidence: '75%',
      publishDate: '2024-01-20',
      source: 'internal'
    },
    {
      id: '4',
      type: 'article',
      title: 'NBA Playoffs Predictions and Analysis',
      content: 'Deep dive into which teams are most likely to make the playoffs...',
      author: 'Basketball Expert',
      tags: ['nba', 'playoffs', 'basketball'],
      publishDate: '2024-01-12',
      source: 'external'
    },
    {
      id: '5',
      type: 'author',
      title: 'Dr. Sarah "Hoops" Williams',
      content: 'PhD in Sports Psychology, former WNBA player with championship ring.',
      expertise: ['Basketball', 'Volleyball'],
      winRate: 92,
      source: 'internal'
    }
  ];

  const searchSuggestions = [
    'Manchester United', 'Premier League', 'NBA playoffs', 'Transfer news',
    'Basketball predictions', 'Football analysis', 'John Rodriguez',
    'Liverpool vs Arsenal', 'Champions League', 'Tennis predictions'
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const performSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredResults = mockResults.filter(result => {
      const matchesQuery = result.title.toLowerCase().includes(query.toLowerCase()) ||
                          result.content?.toLowerCase().includes(query.toLowerCase()) ||
                          result.author?.toLowerCase().includes(query.toLowerCase()) ||
                          result.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

      const matchesType = filters.type === 'all' ||
                         (filters.type === 'articles' && result.type === 'article') ||
                         (filters.type === 'authors' && result.type === 'author') ||
                         (filters.type === 'predictions' && result.type === 'prediction');

      const matchesSport = filters.sport === 'all' ||
                          result.sport?.toLowerCase() === filters.sport ||
                          result.expertise?.some(exp => exp.toLowerCase().includes(filters.sport));

      return matchesQuery && matchesType && matchesSport;
    });

    // Apply sorting
    switch (filters.sortBy) {
      case 'date':
        filteredResults.sort((a, b) =>
          new Date(b.publishDate || '2024-01-01').getTime() -
          new Date(a.publishDate || '2024-01-01').getTime()
        );
        break;
      case 'confidence':
        filteredResults.sort((a, b) => {
          const aConf = parseInt(a.confidence?.replace('%', '') || '0');
          const bConf = parseInt(b.confidence?.replace('%', '') || '0');
          return bConf - aConf;
        });
        break;
      case 'popularity':
        filteredResults.sort((a, b) => (b.winRate || 0) - (a.winRate || 0));
        break;
    }

    setResults(filteredResults);
    setIsSearching(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    performSearch(suggestion);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setShowSuggestions(false);
    searchRef.current?.focus();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'article': return '📰';
      case 'author': return '👤';
      case 'prediction': return '🔮';
      default: return '📄';
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'article': return '#3498db';
      case 'author': return '#e74c3c';
      case 'prediction': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const ResultCard = ({ result }: { result: SearchResult }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '20px',
      margin: '12px 0',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(20px)'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 255, 136, 0.2)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <span style={{ fontSize: '24px' }}>
          {getResultIcon(result.type)}
        </span>
        <div>
          <h3 style={{
            margin: 0,
            color: '#fff',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            {result.title}
          </h3>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            marginTop: '4px'
          }}>
            <span style={{
              background: getResultColor(result.type),
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              textTransform: 'capitalize'
            }}>
              {result.type}
            </span>
            {result.author && (
              <span style={{ fontSize: '12px', color: '#aaa' }}>
                by {result.author}
              </span>
            )}
            {result.confidence && (
              <span style={{
                background: 'rgba(0, 255, 136, 0.2)',
                color: '#00ff88',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {result.confidence}
              </span>
            )}
            {result.winRate && (
              <span style={{
                background: 'rgba(255, 107, 107, 0.2)',
                color: '#ff6b6b',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {result.winRate}% win rate
              </span>
            )}
          </div>
        </div>
      </div>

      <p style={{
        margin: '0 0 12px 0',
        color: '#ccc',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        {result.content?.substring(0, 200)}...
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {result.tags?.map(tag => (
            <span key={tag} style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: '8px',
              fontSize: '11px'
            }}>
              #{tag}
            </span>
          ))}
          {result.expertise?.map(exp => (
            <span key={exp} style={{
              background: 'rgba(0, 162, 255, 0.2)',
              color: '#00a2ff',
              padding: '2px 6px',
              borderRadius: '8px',
              fontSize: '11px'
            }}>
              {exp}
            </span>
          ))}
        </div>
        {result.publishDate && (
          <span style={{ fontSize: '12px', color: '#666' }}>
            {new Date(result.publishDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: '#ffffff',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          margin: '0 0 10px 0',
          fontSize: isMobile ? '24px' : '32px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🔍 Search & Directory
        </h1>
        <p style={{
          margin: 0,
          color: '#aaa',
          fontSize: '16px'
        }}>
          Find articles, authors, and predictions
        </p>
      </div>

      {/* Search Bar */}
      <div style={{
        position: 'relative',
        maxWidth: '800px',
        margin: '0 auto 30px auto'
      }}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for articles, authors, predictions..."
            style={{
              width: '100%',
              padding: '16px 60px 16px 20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '25px',
              color: '#fff',
              fontSize: '16px',
              backdropFilter: 'blur(20px)'
            }}
          />
          <div style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            gap: '8px'
          }}>
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#aaa',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
                border: 'none',
                borderRadius: '15px',
                padding: '8px 16px',
                color: '#000',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🔍
            </button>
          </div>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            marginTop: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            zIndex: 100
          }}>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '12px 20px',
                  cursor: 'pointer',
                  borderBottom: index < suggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                🔍 {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto 30px auto',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <select
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '8px 12px',
            color: '#fff',
            fontSize: '14px'
          }}
        >
          <option value="all">All Types</option>
          <option value="articles">Articles</option>
          <option value="authors">Authors</option>
          <option value="predictions">Predictions</option>
        </select>

        <select
          value={filters.sport}
          onChange={(e) => setFilters(prev => ({ ...prev, sport: e.target.value }))}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '8px 12px',
            color: '#fff',
            fontSize: '14px'
          }}
        >
          <option value="all">All Sports</option>
          <option value="soccer">Soccer</option>
          <option value="basketball">Basketball</option>
          <option value="football">Football</option>
          <option value="tennis">Tennis</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '8px 12px',
            color: '#fff',
            fontSize: '14px'
          }}
        >
          <option value="relevance">Relevance</option>
          <option value="date">Date</option>
          <option value="popularity">Popularity</option>
          <option value="confidence">Confidence</option>
        </select>
      </div>

      {/* Results */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {isSearching ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#aaa'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              animation: 'spin 1s linear infinite'
            }}>
              🔍
            </div>
            Searching...
          </div>
        ) : results.length > 0 ? (
          <>
            <div style={{
              marginBottom: '20px',
              color: '#aaa',
              fontSize: '14px'
            }}>
              Found {results.length} results for "{searchQuery}"
            </div>
            {results.map(result => (
              <ResultCard key={result.id} result={result} />
            ))}
          </>
        ) : searchQuery && !isSearching ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#aaa'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            No results found for "{searchQuery}"
            <br />
            <small>Try different keywords or adjust your filters</small>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#aaa'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            Start typing to search for articles, authors, and predictions
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginTop: '20px',
              flexWrap: 'wrap'
            }}>
              {['Manchester United', 'NBA playoffs', 'Transfer news'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        select option {
          background: #1e293b;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default SearchDirectory;