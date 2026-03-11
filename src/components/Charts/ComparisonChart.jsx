import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatNumber } from '../../utils/formatting'

export default function ComparisonChart({ videos }) {
  if (!videos || videos.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-96 flex items-center justify-center">
        <p className="text-gray-400">No data available for comparison</p>
      </div>
    )
  }

  const data = videos.map((video) => ({
    title: video.snippet.title.substring(0, 15) + '...',
    views: parseInt(video.statistics?.viewCount || 0),
    likes: parseInt(video.statistics?.likeCount || 0),
    comments: parseInt(video.statistics?.commentCount || 0),
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-2 rounded text-xs text-gray-300">
          <p className="font-semibold text-white">{payload[0].payload.title}</p>
          {payload.map((entry, idx) => (
            <p key={idx} style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-white font-semibold mb-4">Videos Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="title" stroke="#6b7280" tick={{ fontSize: 12 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="views" fill="#3b82f6" name="Views" />
          <Bar dataKey="likes" fill="#10b981" name="Likes" />
          <Bar dataKey="comments" fill="#f59e0b" name="Comments" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
