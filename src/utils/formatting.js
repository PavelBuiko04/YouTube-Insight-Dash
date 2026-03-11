export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0'
  
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M'
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K'
  }
  return num.toString()
}

export const formatDuration = (duration) => {
  // Duration is in ISO 8601 format like PT1H23M45S
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'

  const hours = match[1] ? parseInt(match[1]) : 0
  const minutes = match[2] ? parseInt(match[2]) : 0
  const seconds = match[3] ? parseInt(match[3]) : 0

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export const calculateEngagementScore = (statistics) => {
  if (!statistics) return 0
  
  const viewCount = parseInt(statistics.viewCount || 0)
  const likeCount = parseInt(statistics.likeCount || 0)
  const commentCount = parseInt(statistics.commentCount || 0)

  if (viewCount === 0) return 0

  const score = ((likeCount + commentCount) / viewCount) * 100
  return Math.min(score, 100) // Cap at 100%
}

export const calculateEngagementRate = (statistics) => {
  const score = calculateEngagementScore(statistics)
  return score.toFixed(2)
}

export const getEngagementLevel = (score) => {
  if (score >= 10) return { level: 'Excellent', color: 'bg-green-500' }
  if (score >= 5) return { level: 'Good', color: 'bg-blue-500' }
  if (score >= 2) return { level: 'Average', color: 'bg-yellow-500' }
  return { level: 'Low', color: 'bg-red-500' }
}

export const truncateText = (text, length = 100) => {
  if (!text) return ''
  return text.length > length ? `${text.substring(0, length)}...` : text
}

export const calculateAverages = (videos) => {
  if (!videos || videos.length === 0) return {
    avgViews: 0,
    avgLikes: 0,
    avgComments: 0,
    avgEngagement: 0,
  }

  const stats = videos.map(v => v.statistics || {})
  
  const avgViews = stats.reduce((sum, s) => sum + (parseInt(s.viewCount || 0)), 0) / videos.length
  const avgLikes = stats.reduce((sum, s) => sum + (parseInt(s.likeCount || 0)), 0) / videos.length
  const avgComments = stats.reduce((sum, s) => sum + (parseInt(s.commentCount || 0)), 0) / videos.length
  const avgEngagement = stats.reduce((sum, s) => sum + calculateEngagementScore(s), 0) / videos.length

  return { avgViews, avgLikes, avgComments, avgEngagement }
}
