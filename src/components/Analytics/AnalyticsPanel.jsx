import { Eye, ThumbsUp, MessageSquare, TrendingUp, Copy, Check, Zap } from 'lucide-react'
import { useState } from 'react'
import { 
  formatNumber, 
  calculateEngagementRate, 
  getEngagementLevel, 
  truncateText,
  calculateVelocity,
  getVelocityLevel,
  getDaysSincePublish
} from '../../utils/formatting'

// Rating of like percentage quality
const getLikeQuality = (percent) => {
  if (percent > 10) return { level: 'Excellent', color: 'text-green-400', bg: 'from-green-600' }
  if (percent > 5) return { level: 'Good', color: 'text-blue-400', bg: 'from-blue-600' }
  if (percent > 1) return { level: 'Average', color: 'text-yellow-400', bg: 'from-yellow-600' }
  return { level: 'Poor', color: 'text-red-400', bg: 'from-red-600' }
}

// Rating of comment percentage quality
const getCommentQuality = (percent) => {
  if (percent > 1) return { level: 'Excellent', color: 'text-green-400', bg: 'from-green-600' }
  if (percent > 0.5) return { level: 'Good', color: 'text-blue-400', bg: 'from-blue-600' }
  if (percent > 0.1) return { level: 'Average', color: 'text-yellow-400', bg: 'from-yellow-600' }
  return { level: 'Poor', color: 'text-red-400', bg: 'from-red-600' }
}

const StatsCard = ({ icon: Icon, label, value, subtext, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-lg p-4 text-white border border-opacity-20 border-white`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-300 mb-2">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <Icon className="w-6 h-6 opacity-60" />
    </div>
  </div>
)

const SEOTags = ({ tags }) => {
  const [copied, setCopied] = useState(false)

  const handleCopyTags = () => {
    const tagsString = tags.join(', ')
    navigator.clipboard.writeText(tagsString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!tags || tags.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <h4 className="text-white font-semibold mb-3">SEO Tags</h4>
        <p className="text-gray-400 text-sm">No tags available</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-semibold">SEO Tags ({tags.length})</h4>
        <button
          onClick={handleCopyTags}
          className="flex items-center gap-2 text-xs bg-youtube-red hover:bg-red-600 text-white px-2 py-1 rounded transition"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy All'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <span key={idx} className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full hover:bg-gray-700 transition cursor-pointer">
            {truncateText(tag, 20)}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsPanel({ video, similarVideos }) {
  if (!video || !video.statistics) {
    return <div className="text-center text-gray-400 py-8">Loading analytics...</div>
  }

  const stats = video.statistics
  const engagement = calculateEngagementRate(stats)
  const engagementMeta = getEngagementLevel(parseFloat(engagement))
  const tags = video.snippet.tags || []

  const viewCount = parseInt(stats.viewCount || 0)
  const likeCount = parseInt(stats.likeCount || 0)
  const commentCount = parseInt(stats.commentCount || 0)

  const likePercent = viewCount > 0 ? ((likeCount / viewCount) * 100).toFixed(2) : 0
  const commentPercent = viewCount > 0 ? ((commentCount / viewCount) * 100).toFixed(2) : 0

  // Calculate Velocity metrics
  const publishedAt = video.snippet.publishedAt
  const daysSincePublish = getDaysSincePublish(publishedAt)
  const velocity = calculateVelocity(viewCount, publishedAt)
  const velocityMeta = getVelocityLevel(velocity)

  return (
    <div className="space-y-6">
      {/* Title and Description */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-2">{video.snippet.title}</h2>
        <p className="text-gray-400 text-sm mb-4">{truncateText(video.snippet.description, 200)}</p>
        <p className="text-xs text-gray-500">
          Channel: <span className="text-gray-300">{video.snippet.channelTitle}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          icon={Eye}
          label="Views"
          value={formatNumber(viewCount)}
          color="from-blue-600 to-blue-700"
        />
        <StatsCard
          icon={ThumbsUp}
          label="Likes"
          value={formatNumber(likeCount)}
          subtext={`${likePercent}% of views`}
          color="from-green-600 to-green-700"
        />
        <StatsCard
          icon={MessageSquare}
          label="Comments"
          value={formatNumber(commentCount)}
          subtext={`${commentPercent}% of views`}
          color="from-orange-600 to-orange-700"
        />
        <StatsCard
          icon={TrendingUp}
          label="Engagement Score"
          value={`${engagement}%`}
          subtext={engagementMeta.level}
          color="from-youtube-red to-red-700"
        />
        <StatsCard
          icon={Zap}
          label="Velocity"
          value={formatNumber(velocity.toFixed(0))}
          subtext={`${velocityMeta.level}`}
          color="from-purple-600 to-pink-600"
        />
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 text-white border border-opacity-20 border-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-2">Published</p>
              <p className="text-2xl font-bold">{daysSincePublish} days ago</p>
              <p className="text-xs text-gray-400 mt-1">{velocityMeta.desc}</p>
            </div>
            <Eye className="w-6 h-6 opacity-60" />
          </div>
        </div>
      </div>

      {/* SEO Tags */}
      <SEOTags tags={tags} />

      {/* Engagement Breakdown */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <h4 className="text-white font-semibold mb-4">Engagement Breakdown</h4>
        <div className="space-y-4">
          {/* Likes */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-gray-300 text-sm">Likes</span>
                <p className="text-xs text-gray-500 mt-1">
                  {likePercent}% of views
                </p>
              </div>
              <div className={`text-xs font-semibold ${getLikeQuality(parseFloat(likePercent)).color}`}>
                {getLikeQuality(parseFloat(likePercent)).level}
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(likePercent, 100)}%` }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {parseFloat(likePercent) > 10 && '👏 Excellent engagement rate - viewers love this content'}
              {parseFloat(likePercent) > 5 && parseFloat(likePercent) <= 10 && '✅ Good engagement - viewers are actively expressing appreciation'}
              {parseFloat(likePercent) > 1 && parseFloat(likePercent) <= 5 && '⚠️ Average performance - work on improving content quality'}
              {parseFloat(likePercent) <= 1 && '❌ Low engagement - focus on creating more engaging content'}
            </p>
          </div>

          {/* Comments */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-gray-300 text-sm">Comments</span>
                <p className="text-xs text-gray-500 mt-1">
                  {commentPercent}% of views
                </p>
              </div>
              <div className={`text-xs font-semibold ${getCommentQuality(parseFloat(commentPercent)).color}`}>
                {getCommentQuality(parseFloat(commentPercent)).level}
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div className="bg-orange-500 h-full rounded-full" style={{ width: `${Math.min(commentPercent, 100)}%` }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {parseFloat(commentPercent) > 1 && '👏 Excellent - audience is actively discussing your video'}
              {parseFloat(commentPercent) > 0.5 && parseFloat(commentPercent) <= 1 && '✅ Good - viewers are leaving comments and engaging'}
              {parseFloat(commentPercent) > 0.1 && parseFloat(commentPercent) <= 0.5 && '⚠️ Average - encourage discussion by asking questions'}
              {parseFloat(commentPercent) <= 0.1 && '❌ Low - try asking questions to prompt comments'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
