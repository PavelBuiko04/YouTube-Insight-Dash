// Mock data for demo mode when YouTube API key is not configured

export const mockVideoDetails = {
  id: 'dQw4w9WgXcQ',
  snippet: {
    title: 'Web Development Tips - Build Faster with Modern Tools',
    description: 'Learn how to build web applications faster using modern development tools and best practices. This comprehensive guide covers React, Vite, Tailwind CSS, and more.\n\nTopics covered:\n- React 18 fundamentals\n- Vite build optimization\n- Tailwind CSS utilities\n- State management\n- API integration\n\nPerfect for beginners and intermediate developers.',
    channelTitle: 'Tech Learning Hub',
    publishedAt: '2024-03-10T14:30:00Z',
    thumbnails: {
      high: {
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=480&h=360&fit=crop'
      },
      default: {
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120&h=90&fit=crop'
      }
    },
    tags: ['web development', 'react', 'vite', 'tailwind', 'javascript', 'frontend', 'programming', 'tutorial', 'coding', 'web development tutorial']
  },
  statistics: {
    viewCount: '2847392',
    likeCount: '95834',
    commentCount: '12456'
  },
  contentDetails: {
    duration: 'PT45M32S'
  }
}

export const mockSearchResults = {
  items: [
    {
      kind: 'youtube#searchResult',
      etag: 'mock-etag-1',
      id: {
        kind: 'youtube#video',
        videoId: 'dQw4w9WgXcQ'
      },
      snippet: {
        publishedAt: '2024-03-10T14:30:00Z',
        channelId: 'UCxxxxxx',
        title: 'Web Development Tips - Build Faster with Modern Tools',
        description: 'Learn how to build web applications faster using modern development tools and best practices.',
        thumbnails: {
          default: {
            url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120&h=90&fit=crop'
          }
        },
        channelTitle: 'Tech Learning Hub',
        liveBroadcastContent: 'none'
      }
    },
    {
      kind: 'youtube#searchResult',
      etag: 'mock-etag-2',
      id: {
        kind: 'youtube#video',
        videoId: 'anotherID1'
      },
      snippet: {
        publishedAt: '2024-03-09T10:15:00Z',
        channelId: 'UCyyyyyy',
        title: 'React Hooks Deep Dive - Advanced Patterns Explained',
        description: 'Master advanced React Hooks patterns and techniques for building scalable applications.',
        thumbnails: {
          default: {
            url: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=120&h=90&fit=crop'
          }
        },
        channelTitle: 'Code Masters',
        liveBroadcastContent: 'none'
      }
    },
    {
      kind: 'youtube#searchResult',
      etag: 'mock-etag-3',
      id: {
        kind: 'youtube#video',
        videoId: 'anotherID2'
      },
      snippet: {
        publishedAt: '2024-03-08T16:45:00Z',
        channelId: 'UCzzzzzz',
        title: 'Tailwind CSS 3 - Complete Guide for Beginners',
        description: 'Everything you need to know about Tailwind CSS 3 and utility-first CSS approach.',
        thumbnails: {
          default: {
            url: 'https://images.unsplash.com/photo-1517694712404-3d19db3c9310?w=120&h=90&fit=crop'
          }
        },
        channelTitle: 'Frontend Mastery',
        liveBroadcastContent: 'none'
      }
    },
    {
      kind: 'youtube#searchResult',
      etag: 'mock-etag-4',
      id: {
        kind: 'youtube#video',
        videoId: 'anotherID3'
      },
      snippet: {
        publishedAt: '2024-03-07T12:20:00Z',
        channelId: 'UCaaaaaa',
        title: 'JavaScript Performance Optimization Techniques',
        description: 'Learn proven techniques to optimize your JavaScript code for better performance.',
        thumbnails: {
          default: {
            url: 'https://images.unsplash.com/photo-1534633746710-e4506cdc6fa0?w=120&h=90&fit=crop'
          }
        },
        channelTitle: 'Dev Pro Tips',
        liveBroadcastContent: 'none'
      }
    }
  ]
}

export const mockChannelVideos = [
  {
    id: 'vid1',
    snippet: {
      title: 'Getting Started with Vite',
      thumbnails: { default: { url: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=320&h=180&fit=crop' } }
    },
    statistics: { viewCount: '1200000', likeCount: '45000', commentCount: '3200' }
  },
  {
    id: 'vid2',
    snippet: {
      title: 'React Hooks Explained',
      thumbnails: { default: { url: 'https://images.unsplash.com/photo-1628371291335-94d440c474fe?w=320&h=180&fit=crop' } }
    },
    statistics: { viewCount: '890000', likeCount: '32000', commentCount: '2100' }
  },
  {
    id: 'vid3',
    snippet: {
      title: 'CSS Grid Mastery',
      thumbnails: { default: { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=320&h=180&fit=crop' } }
    },
    statistics: { viewCount: '567000', likeCount: '21000', commentCount: '1400' }
  },
  {
    id: 'vid4',
    snippet: {
      title: 'TypeScript for Beginners',
      thumbnails: { default: { url: 'https://images.unsplash.com/photo-1633356270525-2a8e5a6dd21c?w=320&h=180&fit=crop' } }
    },
    statistics: { viewCount: '2100000', likeCount: '78000', commentCount: '5600' }
  },
  {
    id: 'vid5',
    snippet: {
      title: 'Web Performance Optimization',
      thumbnails: { default: { url: 'https://images.unsplash.com/photo-1455849318169-8c8e6bed8e04?w=320&h=180&fit=crop' } }
    },
    statistics: { viewCount: '1450000', likeCount: '52000', commentCount: '3800' }
  }
]
