
import React, { useState } from 'react';

const LatestNews = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const newsItems = [
    {
      id: 1,
      title: "Village Tragedy Shakes Community",
      preview: "The news of Ella's father passing shook the entire village...",
      fullContent: "The news of Ella's father passing shook the entire village. He was a respected member of the community, known for his kindness and wisdom. The funeral was attended by hundreds of people who came to pay their respects. Ella found herself overwhelmed by the support from neighbors and friends during this difficult time."
    },
    {
      id: 2,
      title: "New Responsibilities Emerge",
      preview: "In the days that followed, Ella found herself burdened with new responsibilities...",
      fullContent: "In the days that followed, Ella found herself burdened with new responsibilities that she had never imagined. Managing her father's affairs, taking care of the family business, and supporting her younger siblings became her daily reality. Despite the challenges, she discovered inner strength she didn't know she possessed and began to see a path forward through the difficulties."
    },
    {
      id: 3,
      title: "Community Support Grows",
      preview: "Local businesses and neighbors have rallied together to help...",
      fullContent: "Local businesses and neighbors have rallied together to help Ella and her family during this transition period. A support fund has been established, meals are being provided daily, and volunteers have stepped up to assist with various tasks. This outpouring of community spirit has shown the true character of the village and provided hope for the future."
    }
  ];

  const toggleExpand = (itemId: number) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isExpanded = (itemId: number) => expandedItems.includes(itemId);

  return (
    <div className="glass-card" style={{
      padding: '24px',
      marginBottom: '30px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}>
        📰 Latest News
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {newsItems.map((item) => (
          <div 
            key={item.id}
            style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <h4 style={{
              color: '#e8f5e8',
              marginBottom: '8px',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}>
              {item.title}
            </h4>
            
            <p style={{
              color: '#d1fae5',
              lineHeight: '1.6',
              marginBottom: '12px'
            }}>
              {isExpanded(item.id) ? item.fullContent : item.preview}
            </p>
            
            <button
              onClick={() => toggleExpand(item.id)}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(34, 197, 94, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
              }}
            >
              {isExpanded(item.id) ? '📖 Read Less' : '📚 Read More'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestNews;
