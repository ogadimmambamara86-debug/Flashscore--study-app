import React, { useState, useEffect } from 'react';
import { ClientStorage } from '../utils/clientStorage';
import { NewsItem, NewsAuthor } from '../services/newsService';

const LatestNews: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showStoryEditor, setShowStoryEditor] = useState<boolean>(false);
  const [editingStory, setEditingStory] = useState<NewsItem | undefined>(undefined);

  // Check if user is logged in (for guest experience)
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Simple check for logged in user
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    const userData = localStorage.getItem('currentUser');
    setCurrentUser(adminLoggedIn === 'true' || userData ? JSON.parse(userData || '{}') : null);
  }, []);

  // Initialize news items from local storage or default
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
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
      ]);

  useEffect(() => {
    // Load news items from localStorage on client side
    const defaultNews = [
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
        preview: "The community rallied around Ella and her family...",
        fullContent: "The community rallied around Ella and her family during their time of need. Local businesses offered support, neighbors brought meals, and friends provided emotional comfort. This outpouring of kindness reminded everyone of the strength that comes from unity and shared compassion."
      }
    ];

    const storedNews = ClientStorage.getItem('newsItems', defaultNews);
    setNewsItems(storedNews);
  }, []);

  // Save news items to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('newsItems', JSON.stringify(newsItems));
  }, [newsItems]);

  const toggleExpand = (itemId: number) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isExpanded = (itemId: number) => expandedItems.includes(itemId);

  // Enhanced auto-login with session management
  useEffect(() => {
    const checkAutoLogin = () => {
      const adminLoggedIn = localStorage.getItem('adminLoggedIn');
      const adminSessionExpiry = localStorage.getItem('adminSessionExpiry');
      const rememberMe = localStorage.getItem('adminRememberMe');
      
      if (adminLoggedIn === 'true') {
        // Check if session is still valid
        if (adminSessionExpiry && Date.now() < parseInt(adminSessionExpiry)) {
          setIsLoggedIn(true);
          // Extend session if remember me is enabled
          if (rememberMe === 'true') {
            const newExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
            localStorage.setItem('adminSessionExpiry', newExpiry.toString());
          }
        } else {
          // Session expired, clear login
          localStorage.removeItem('adminLoggedIn');
          localStorage.removeItem('adminSessionExpiry');
          localStorage.removeItem('adminRememberMe');
          setIsLoggedIn(false);
        }
      }
    };

    checkAutoLogin();
    // Check session every 5 minutes
    const sessionCheckInterval = setInterval(checkAutoLogin, 5 * 60 * 1000);
    
    return () => clearInterval(sessionCheckInterval);
  }, []);

  // Enhanced login handler with session management
  const handleLogin = (credentials: { username: string; password: string; rememberMe?: boolean }) => {
    // Simple authentication (in production, use proper authentication)
    const adminCredentials = { 
      username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin', 
      password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'securePassword123!' 
    };
    
    if (credentials.username === adminCredentials.username && credentials.password === adminCredentials.password) {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      
      // Set session expiry
      const sessionDuration = credentials.rememberMe ? (7 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000); // 7 days vs 24 hours
      const expiryTime = Date.now() + sessionDuration;
      localStorage.setItem('adminSessionExpiry', expiryTime.toString());
      
      if (credentials.rememberMe) {
        localStorage.setItem('adminRememberMe', 'true');
      }
      
      setShowLoginModal(false);
      
      // Show success message
      if (window.showAlert) {
        window.showAlert('✅ Admin login successful!', 'success');
      }
    } else {
      alert('Invalid credentials. Use admin/securePassword123!');
    }
  };

  // Enhanced logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminSessionExpiry');
    localStorage.removeItem('adminRememberMe');
    
    if (window.showAlert) {
      window.showAlert('👋 Admin logged out successfully!', 'info');
    }
  };

  // Story handlers
  const handleSaveStory = (story: NewsItem) => {
    if (story.id) {
      // Update existing story
      setNewsItems(prev => prev.map(item =>
        item.id === story.id ? story : item
      ));
    } else {
      // Add new story
      const newStory = {
        ...story,
        id: Math.max(0, ...newsItems.map(item => item.id)) + 1 // Ensure id is positive
      };
      setNewsItems(prev => [newStory, ...prev]);
    }
    setShowStoryEditor(false);
    setEditingStory(undefined);
  };

  const handleEditStory = (story: NewsItem) => {
    setEditingStory(story);
    setShowStoryEditor(true);
  };

  const handleDeleteStory = (storyId: number) => {
    if (confirm('Are you sure you want to delete this story?')) {
      setNewsItems(prev => prev.filter(item => item.id !== storyId));
    }
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          📰 Latest News
        </h3>
        <div>
          {/* Show admin controls only if user is actually an admin */}
          {!isLoggedIn && !currentUser && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ 
                color: '#d1fae5', 
                fontSize: '0.8rem',
                padding: '4px 8px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                📰 Live News Feed
              </span>
              <button onClick={() => setShowLoginModal(true)} style={{
                background: 'linear-gradient(135deg, #facc15, #eab308)',
                color: 'black',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
              }}>Admin</button>
            </div>
          )}

          {!isLoggedIn && currentUser && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ 
                color: '#22c55e', 
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                Welcome {currentUser.username || 'User'}! 👋
              </span>
              <button onClick={() => setShowLoginModal(true)} style={{
                background: 'linear-gradient(135deg, #facc15, #eab308)',
                color: 'black',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
              }}>Admin</button>
            </div>
          )}

          {isLoggedIn && (
            <>
              <button onClick={handleLogout} style={{
                background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
              }}>Logout</button>
              <button onClick={() => { setEditingStory(undefined); setShowStoryEditor(true); }} style={{
                marginLeft: '10px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
              }}>+ Add Story</button>
            </>
          )}
        </div>
      </div>

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{
                color: '#e8f5e8',
                marginBottom: '8px',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>
                {item.title}
              </h4>
              {isLoggedIn && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEditStory(item)} style={{ /* Edit Button Styles */
                    background: 'none', color: '#a0aec0', border: 'none', cursor: 'pointer', fontSize: '0.8rem'
                  }}>Edit</button>
                  <button onClick={() => handleDeleteStory(item.id)} style={{ /* Delete Button Styles */
                    background: 'none', color: '#f56565', border: 'none', cursor: 'pointer', fontSize: '0.8rem'
                  }}>Delete</button>
                </div>
              )}
            </div>

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

        {/* Sign-up prompt for guests */}
        {!currentUser && !isLoggedIn && (
          <div style={{
            marginTop: '24px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(6, 182, 212, 0.05))',
            borderRadius: '12px',
            border: '2px dashed rgba(34, 197, 94, 0.3)',
            textAlign: 'center'
          }}>
            <h4 style={{
              color: '#22c55e',
              marginBottom: '12px',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              🎯 Want More Sports Content?
            </h4>
            <p style={{
              color: '#d1fae5',
              marginBottom: '16px',
              fontSize: '0.9rem'
            }}>
              Join Sports Central for exclusive predictions, quizzes, and π50 welcome bonus!
            </p>
            <button
              onClick={() => {
                // Trigger registration modal (assuming parent component handles this)
                window.dispatchEvent(new CustomEvent('openRegistration'));
              }}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
              }}
            >
              🚀 Sign Up Free
            </button>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div style={{ /* Modal Overlay Styles */
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ /* Modal Content Styles */
            background: 'rgba(255, 255, 255, 0.1)', padding: '30px',
            borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(15px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px' }}>Admin Login</h3>
            <input
              id="admin-username"
              type="text"
              placeholder="Username (admin)"
              style={{ /* Input Styles */
                background: 'rgba(255, 255, 255, 0.1)', color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px',
                padding: '10px', marginBottom: '15px', width: 'calc(100% - 20px)'
              }}
            />
            <input
              id="admin-password"
              type="password"
              placeholder="Password (securePassword123!)"
              style={{ /* Input Styles */
                background: 'rgba(255, 255, 255, 0.1)', color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px',
                padding: '10px', marginBottom: '15px', width: 'calc(100% - 20px)'
              }}
            />
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '20px',
              color: 'white'
            }}>
              <input
                id="admin-remember"
                type="checkbox"
                style={{ marginRight: '8px' }}
              />
              <label htmlFor="admin-remember" style={{ fontSize: '0.9rem' }}>
                Remember me (7 days)
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setShowLoginModal(false)} style={{ /* Cancel Button Styles */
                background: 'linear-gradient(135deg, #9ca3af, #6b7280)', color: 'white',
                border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={() => {
                const usernameInput = document.getElementById('admin-username') as HTMLInputElement;
                const passwordInput = document.getElementById('admin-password') as HTMLInputElement;
                const rememberInput = document.getElementById('admin-remember') as HTMLInputElement;
                if (usernameInput && passwordInput) {
                  handleLogin({ 
                    username: usernameInput.value, 
                    password: passwordInput.value,
                    rememberMe: rememberInput?.checked || false
                  });
                }
              }} style={{ /* Login Button Styles */
                background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white',
                border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer'
              }}>Login</button>
            </div>
          </div>
        </div>
      )}

      {/* Story Editor Modal */}
      {showStoryEditor && (
        <div style={{ /* Modal Overlay Styles */
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ /* Modal Content Styles */
            background: 'rgba(255, 255, 255, 0.1)', padding: '30px',
            borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(15px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            width: '80%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px' }}>{editingStory ? 'Edit Story' : 'Add New Story'}</h3>
            <input
              id="story-title"
              type="text"
              placeholder="Title"
              defaultValue={editingStory?.title || ''}
              style={{ /* Input Styles */
                background: 'rgba(255, 255, 255, 0.1)', color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px',
                padding: '10px', marginBottom: '15px', width: 'calc(100% - 20px)'
              }}
            />
            <textarea
              id="story-preview"
              placeholder="Preview Text"
              defaultValue={editingStory?.preview || ''}
              style={{ /* Textarea Styles */
                background: 'rgba(255, 255, 255, 0.1)', color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px',
                padding: '10px', marginBottom: '15px', width: 'calc(100% - 20px)',
                minHeight: '80px', resize: 'vertical'
              }}
            />
            <textarea
              id="story-fullContent"
              placeholder="Full Content"
              defaultValue={editingStory?.fullContent || ''}
              style={{ /* Textarea Styles */
                background: 'rgba(255, 255, 255, 0.1)', color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px',
                padding: '10px', marginBottom: '20px', width: 'calc(100% - 20px)',
                minHeight: '150px', resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => { setShowStoryEditor(false); setEditingStory(undefined); }} style={{ /* Cancel Button Styles */
                background: 'linear-gradient(135deg, #9ca3af, #6b7280)', color: 'white',
                border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={() => {
                const titleInput = document.getElementById('story-title') as HTMLInputElement;
                const previewInput = document.getElementById('story-preview') as HTMLTextAreaElement;
                const fullContentInput = document.getElementById('story-fullContent') as HTMLTextAreaElement;
                if (titleInput && previewInput && fullContentInput) {
                  const newStory: NewsItem = {
                    id: editingStory?.id || 0, // Use existing ID if editing, 0 if new
                    title: titleInput.value,
                    preview: previewInput.value,
                    fullContent: fullContentInput.value
                  };
                  handleSaveStory(newStory);
                }
              }} style={{ /* Save Button Styles */
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer'
              }}>{editingStory ? 'Save Changes' : 'Add Story'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestNews;