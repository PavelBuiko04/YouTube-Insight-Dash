import axios from 'axios'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
})

export const searchVideos = async (query) => {
  try {
    const response = await api.get('/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 20,
        order: 'relevance',
      },
    })
    return response.data
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
}

export const getVideoDetails = async (videoId) => {
  try {
    const response = await api.get('/videos', {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
      },
    })
    return response.data.items[0]
  } catch (error) {
    console.error('Video details error:', error)
    throw error
  }
}

export const getChannelDetails = async (channelId) => {
  try {
    const response = await api.get('/channels', {
      params: {
        part: 'snippet,statistics',
        id: channelId,
      },
    })
    return response.data.items[0]
  } catch (error) {
    console.error('Channel details error:', error)
    throw error
  }
}
