import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { Loader2 } from 'lucide-react'
import { formatNumber } from '../../utils/formatting'

export default function ComparisonChart({ videos, isLoading = false, onVideoClick }) {
  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-youtube-red animate-spin" />
          <p className="text-gray-400">Loading comparison data...</p>
        </div>
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-96 flex items-center justify-center">
        <p className="text-gray-400">No data available for comparison</p>
      </div>
    )
  }

  // Filter videos with valid statistics
  const validVideos = videos.filter(v => v.statistics && (
    parseInt(v.statistics.viewCount || 0) > 0 ||
    parseInt(v.statistics.likeCount || 0) > 0 ||
    parseInt(v.statistics.commentCount || 0) > 0
  ))

  if (validVideos.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-96 flex items-center justify-center">
        <p className="text-gray-400">No statistics available for selected videos</p>
      </div>
    )
  }

  const data = validVideos.map((video) => ({
    title: (video.snippet?.title || 'Video').substring(0, 20) + '...',
    views: parseInt(video.statistics?.viewCount || 0),
    likes: parseInt(video.statistics?.likeCount || 0),
    comments: parseInt(video.statistics?.commentCount || 0),
    videoId: video.id,
    fullTitle: video.snippet?.title,
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded text-xs text-gray-300 shadow-lg">
          <p className="font-semibold text-white mb-2">{payload[0].payload.fullTitle}</p>
          {payload.map((entry, idx) => (
            <p key={idx} style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
          <p className="text-gray-500 mt-2 italic">Click to select video</p>
        </div>
      )
    }
    return null
  }

  const handleBarClick = (data) => {
    if (onVideoClick && data.videoId) {
      onVideoClick(data.videoId)
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-white font-semibold mb-4">Videos Comparison (Click to select)</h3>
      <div className="w-full overflow-x-auto">
        <ResponsiveContainer width="100%" height={300} minWidth={400}>
          <BarChart data={data}>
            <XAxis 
              dataKey="title" 
              stroke="#6b7280" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#6b7280" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="views" 
              fill="#3b82f6" 
              name="Views"
              onClick={(entry) => handleBarClick(entry)}
              cursor="pointer"
            />
            <Bar 
              dataKey="likes" 
              fill="#10b981" 
              name="Likes"
              onClick={(entry) => handleBarClick(entry)}
              cursor="pointer"
            />
            <Bar 
              dataKey="comments" 
              fill="#f59e0b" 
              name="Comments"
              onClick={(entry) => handleBarClick(entry)}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="views" fill="#3b82f6" name="Views" />
            <Bar dataKey="likes" fill="#10b981" name="Likes" />
            <Bar dataKey="comments" fill="#f59e0b" name="Comments" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
