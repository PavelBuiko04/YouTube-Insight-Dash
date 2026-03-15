import axios from 'axios'

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3'

if (!YOUTUBE_API_KEY) {
  console.warn('VITE_YOUTUBE_API_KEY is not set. Please check your .env.local file.')
}

const api = axios.create({
  baseURL: YOUTUBE_BASE_URL,
  params: {
    key: YOUTUBE_API_KEY,
  },
})

export const searchVideos = async (query) => {
  try {
    const response = await api.get('/search', { params: { 
      q: query,
      part: 'snippet',
      type: 'video',
      maxResults: 20,
      order: 'relevance'
    } })
    return response.data
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
}

export const getVideoDetails = async (videoId) => {
  try {
    const response = await api.get('/videos', { params: { 
      id: videoId,
      part: 'snippet,statistics,contentDetails'
    } })
    return response.data.items?.[0] || null
  } catch (error) {
    console.error('Video details error:', error)
    throw error
  }
}

export const getVideoStatistics = async (videoIds) => {
  if (!videoIds || videoIds.length === 0) return []
  
  try {
    // YouTube API allows max 50 IDs per request
    const ids = videoIds.slice(0, 50).join(',')
    const response = await api.get('/videos', { params: { 
      id: ids,
      part: 'snippet,statistics,contentDetails'
    } })
    return response.data.items || []
  } catch (error) {
    console.error('Video statistics error:', error)
    return []
  }
}

export const getChannelDetails = async (channelId) => {
  try {
    const response = await api.get('/channels', { params: { 
      id: channelId,
      part: 'snippet,statistics'
    } })
    return response.data.items?.[0] || null
  } catch (error) {
    console.error('Channel details error:', error)
    throw error
  }
}

export const searchVideosByChannel = async (channelId) => {
  if (!channelId) return null
  
  try {
    const response = await api.get('/search', { params: { 
      channelId,
      part: 'snippet',
      type: 'video',
      maxResults: 20,
      order: 'viewCount'
    } })
    return response.data
  } catch (error) {
    console.error('Channel search error:', error)
    return null
  }
}

export const getVideoComments = async (videoId, maxComments = 100) => {
  if (!videoId) return []
  if (!maxComments || maxComments <= 0) return []
  
  try {
    const max = Math.max(1, Math.min(maxComments, 500))
    const comments = []
    let pageToken = undefined

    while (comments.length < max) {
      const remaining = max - comments.length
      const response = await api.get('/commentThreads', {
        params: {
          part: 'snippet',
          videoId,
          maxResults: Math.min(100, remaining),
          order: 'relevance',
          textFormat: 'plainText',
          pageToken,
        },
      })

      const batch = (response.data.items || []).map(item =>
        item.snippet.topLevelComment.snippet.textDisplay
      )
      comments.push(...batch)

      pageToken = response.data.nextPageToken
      if (!pageToken || batch.length === 0) break
    }

    return comments.slice(0, max)
  } catch (error) {
    console.error('Video comments error:', error)
    return []
  }
}
