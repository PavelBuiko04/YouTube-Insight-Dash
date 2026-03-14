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

export const durationToSeconds = (duration) => {
  if (!duration) return 0
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = match[1] ? parseInt(match[1]) : 0
  const minutes = match[2] ? parseInt(match[2]) : 0
  const seconds = match[3] ? parseInt(match[3]) : 0

  return (hours * 3600) + (minutes * 60) + seconds
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

// Calculate days since video publication
export const getDaysSincePublish = (publishedAt) => {
  if (!publishedAt) return 0
  
  try {
    const publishDate = new Date(publishedAt)
    const today = new Date()
    const timeDiff = today.getTime() - publishDate.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return Math.max(daysDiff, 1) // Minimum 1 day to avoid division by zero
  } catch (error) {
    console.error('Error calculating days:', error)
    return 1
  }
}

// Calculate Velocity (views per day)
export const calculateVelocity = (viewCount, publishedAt) => {
  if (!viewCount || viewCount === 0 || !publishedAt) return 0
  
  const views = parseInt(viewCount)
  const days = getDaysSincePublish(publishedAt)
  return views / days
}

// Get virality level based on Velocity
export const getVelocityLevel = (velocity) => {
  if (velocity > 100000) return { level: 'Viral 🚀', color: 'text-red-400', desc: 'Extremely viral content' }
  if (velocity > 50000) return { level: 'Trending 🔥', color: 'text-orange-400', desc: 'Very high growth rate' }
  if (velocity > 10000) return { level: 'Excellent 👍', color: 'text-green-400', desc: 'Strong viewership growth' }
  if (velocity > 1000) return { level: 'Good ✅', color: 'text-blue-400', desc: 'Healthy growth rate' }
  if (velocity > 100) return { level: 'Average 📊', color: 'text-yellow-400', desc: 'Moderate growth' }
  return { level: 'Slow 📉', color: 'text-gray-400', desc: 'Low growth rate' }
}

// Analyze sentiment of comments
export const analyzeSentiment = (comments, percentToAnalyze = 100) => {
  if (!comments || comments.length === 0) {
    return { 
      sentiment: 'No Data', 
      score: 0, 
      positive: 0, 
      neutral: 0, 
      negative: 0,
      total: 0,
      analyzed: 0
    }
  }

  try {
    // Calculate how many comments to analyze based on percentage
    const commentsToAnalyze = Math.ceil((comments.length * percentToAnalyze) / 100)
    const analyzedComments = comments.slice(0, commentsToAnalyze)

    // Simple sentiment analysis based on keyword matching
    const positiveKeywords = ['love', 'great', 'amazing', 'awesome', 'excellent', 'perfect', 'best', 'good', 'nice', 'thank', 'thanks', 'brilliant', 'wonderful', 'fantastic', 'cool']
    const negativeKeywords = ['hate', 'bad', 'terrible', 'awful', 'worst', 'horrible', 'disgusting', 'poor', 'wrong', 'sad', 'disappointed', 'waste', 'stupid', 'trash', 'useless']

    let positive = 0
    let negative = 0
    let neutral = 0

    analyzedComments.forEach(comment => {
      const lowerComment = comment.toLowerCase()
      
      const hasPositive = positiveKeywords.some(keyword => lowerComment.includes(keyword))
      const hasNegative = negativeKeywords.some(keyword => lowerComment.includes(keyword))

      if (hasPositive && !hasNegative) {
        positive++
      } else if (hasNegative && !hasPositive) {
        negative++
      } else {
        neutral++
      }
    })

    // Calculate overall sentiment
    const total = analyzedComments.length
    const positiveRatio = (positive / total) * 100
    const negativeRatio = (negative / total) * 100
    const neutralRatio = (neutral / total) * 100

    let sentiment = 'Neutral'
    let score = 0

    if (positiveRatio > 60) {
      sentiment = 'Positive'
      score = positiveRatio
    } else if (negativeRatio > 40) {
      sentiment = 'Negative'
      score = negativeRatio
    } else if (positiveRatio > negativeRatio + 15) {
      sentiment = 'Mostly Positive'
      score = positiveRatio
    } else if (negativeRatio > positiveRatio + 15) {
      sentiment = 'Mostly Negative'
      score = negativeRatio
    } else if (Math.abs(positiveRatio - negativeRatio) > 20) {
      sentiment = 'Mixed'
      score = Math.max(positiveRatio, negativeRatio)
    }

    return {
      sentiment,
      score: score.toFixed(1),
      positive: parseInt(positive),
      neutral: parseInt(neutral),
      negative: parseInt(negative),
      total: comments.length,
      analyzed: total,
    }
  } catch (error) {
    console.error('Sentiment analysis error:', error)
    return { 
      sentiment: 'Error', 
      score: 0, 
      positive: 0, 
      neutral: 0, 
      negative: 0,
      total: 0,
      analyzed: 0
    }
  }
}

// Get sentiment level styling
export const getSentimentLevel = (sentiment) => {
  switch (sentiment) {
    case 'Positive':
      return { level: 'Positive 👍', emoji: '👍', color: 'text-green-400', bg: 'from-green-600 to-green-700', desc: 'Audience loves this content' }
    case 'Mostly Positive':
      return { level: 'Mostly Positive 😊', emoji: '😊', color: 'text-green-300', bg: 'from-green-500 to-green-600', desc: 'Generally positive feedback' }
    case 'Mixed':
      return { level: 'Mixed 🤷', emoji: '🤷', color: 'text-yellow-400', bg: 'from-yellow-600 to-yellow-700', desc: 'Divided audience opinions' }
    case 'Mostly Negative':
      return { level: 'Mostly Negative 😟', emoji: '😟', color: 'text-orange-400', bg: 'from-orange-600 to-orange-700', desc: 'Mostly critical feedback' }
    case 'Negative':
      return { level: 'Negative 👎', emoji: '👎', color: 'text-red-400', bg: 'from-red-600 to-red-700', desc: 'Audience dislikes this content' }
    default:
      return { level: 'No Data', emoji: '❓', color: 'text-gray-400', bg: 'from-gray-600 to-gray-700', desc: 'Unable to analyze sentiment' }
  }
}
