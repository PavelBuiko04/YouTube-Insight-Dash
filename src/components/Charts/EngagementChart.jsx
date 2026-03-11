import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2 } from 'lucide-react'

export default function EngagementChart({ video, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-youtube-red animate-spin" />
          <p className="text-gray-400">Loading engagement data...</p>
        </div>
      </div>
    )
  }

  if (!video || !video.statistics) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-96 flex items-center justify-center">
        <p className="text-gray-400">No data available</p>
      </div>
    )
  }

  const stats = video.statistics
  const likeCount = parseInt(stats.likeCount || 0)
  const commentCount = parseInt(stats.commentCount || 0)
  const viewCount = parseInt(stats.viewCount || 0)

  const data = [
    { name: 'Likes', value: likeCount },
    { name: 'Comments', value: commentCount },
    { name: 'Others', value: Math.max(0, viewCount - likeCount - commentCount) },
  ].filter(item => item.value > 0)

  if (data.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-96 flex items-center justify-center">
        <p className="text-gray-400">No engagement data available</p>
      </div>
    )
  }

  const COLORS = ['#10b981', '#f59e0b', '#6b7280']

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = data.reduce((sum, item) => sum + item.value, 0)
      const percent = ((payload[0].value / total) * 100).toFixed(1)
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded text-xs text-gray-300 shadow-lg">
          <p className="font-semibold text-white mb-1">{payload[0].name}</p>
          <p>{payload[0].value.toLocaleString()}</p>
          <p className="text-gray-400">{percent}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-white font-semibold mb-4">Engagement Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
