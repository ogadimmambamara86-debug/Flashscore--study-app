'use client';

import React, { useState, useEffect } from 'react';
import { NewsItem, NewsAuthor } from '../services/newsService';

interface AuthorNewsDisplayProps {
  news: NewsItem[];
  className?: string;
}

const AuthorNewsDisplay: React.FC<AuthorNewsDisplayProps> = ({ news, className = '' }) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    const userData = localStorage.getItem('currentUser');
    setIsLoggedIn(adminLoggedIn === 'true' || !!userData);
  }, []);

  const handleReadMore = (newsId: number) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    setExpandedItems(prev => 
      prev.includes(newsId) 
        ? prev.filter(id => id !== newsId)
        : [...prev, newsId]
    );
  };

  const formatAuthor = (author: string | NewsAuthor): { name: string; icon: string; collaborationCount?: number } => {
    if (typeof author === 'string') {
      return { name: author, icon: '📝' };
    }
    return {
      name: author.name,
      icon: author.icon,
      collaborationCount: author.collaborationCount
    };
  };

  const getCollaborationTypeBadge = (type?: string) => {
    const badges = {
      'prediction': { icon: '🎯', color: 'bg-green-600', text: 'Prediction' },
      'analysis': { icon: '📊', color: 'bg-blue-600', text: 'Analysis' },
      'community': { icon: '🏆', color: 'bg-purple-600', text: 'Community' },
      'update': { icon: '📰', color: 'bg-gray-600', text: 'Update' }
    };
    
    const badge = badges[type as keyof typeof badges] || badges.update;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${badge.color} text-white`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">🔒 Member Access Required</h3>
            <p className="text-gray-300 mb-6">
              To read the full content of news articles, please log in as a member. 
              Guests can view previews only.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  // In a real app, this would trigger login flow
                  alert('Login functionality would be triggered here');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* News Items */}
      {news.map((item) => {
        const author = formatAuthor(item.author);
        const isExpanded = expandedItems.includes(item.id);
        
        return (
          <article key={item.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {/* Author Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{author.icon}</span>
                <div>
                  <h3 className="font-semibold text-white">{author.name}</h3>
                  {author.collaborationCount && (
                    <p className="text-gray-400 text-sm">
                      {author.collaborationCount} collaboration{author.collaborationCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.collaborationType && getCollaborationTypeBadge(item.collaborationType)}
                <span className="text-gray-400 text-sm">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* News Content */}
            <h2 className="text-xl font-bold text-white mb-3">{item.title}</h2>
            
            <div className="text-gray-300">
              <p className="mb-4">{item.preview}</p>
              
              {/* Full Content (Members Only) */}
              {isExpanded && isLoggedIn && (
                <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-blue-400">👑</span>
                    <span className="text-blue-400 text-sm font-medium">Member Content</span>
                  </div>
                  <p className="text-gray-200 leading-relaxed">{item.fullContent}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <span>👁️</span>
                  {item.viewCount} views
                </span>
                
                <button
                  onClick={() => handleReadMore(item.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isLoggedIn
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {isExpanded ? 'Show Less' : isLoggedIn ? 'Read More' : 'Login to Read More'}
                  {!isLoggedIn && <span className="ml-1">🔒</span>}
                </button>
              </div>
            </div>
          </article>
        );
      })}

      {/* Guest Notice */}
      {!isLoggedIn && (
        <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">ℹ️</span>
            <p className="text-yellow-200">
              <strong>Guest Access:</strong> You can read news previews. 
              <button 
                onClick={() => alert('Login functionality would be triggered here')}
                className="underline ml-1 hover:text-yellow-100"
              >
                Login as a member
              </button> 
              {' '}to access full articles.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorNewsDisplay;