import { useState } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatNumber, formatDuration, durationToSeconds } from '../../utils/formatting'

export default function DurationViewsChart({ videos, isLoading = false, totalAvailable = 0, limit = 5, showPro = false, onLimitChange }) {
  const [minMinutes, setMinMinutes] = useState(0)
  const [maxMinutes, setMaxMinutes] = useState(60)

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-96 flex items-center justify-center">
        <p className="text-gray-400">Loading duration data...</p>
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-96 flex items-center justify-center">
        <p className="text-gray-400">No duration data available</p>
      </div>
    )
  }

  const normalizedMin = Math.max(0, Math.min(minMinutes, maxMinutes))
  const normalizedMax = Math.max(normalizedMin, maxMinutes)
  const minSeconds = normalizedMin * 60
  const maxSeconds = normalizedMax * 60

  const filtered = videos
    .filter(v => v?.statistics?.viewCount && v?.contentDetails?.duration)
    .map((video) => {
      const durationSeconds = durationToSeconds(video.contentDetails.duration)
      return {
        title: video.snippet?.title || 'Video',
        durationSeconds,
        durationLabel: formatDuration(video.contentDetails.duration),
        views: parseInt(video.statistics.viewCount || 0),
      }
    })
    .filter(d => d.durationSeconds > 0 && d.views > 0)
    .filter(d => d.durationSeconds >= minSeconds && d.durationSeconds <= maxSeconds)
    .slice(0, limit)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded text-xs text-gray-300 shadow-lg">
          <p className="font-semibold text-white mb-2">{p.title}</p>
          <p>Duration: {p.durationLabel}</p>
          <p>Views: {formatNumber(p.views)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-white font-semibold">Video Duration vs View Count</h3>
          <p className="text-xs text-gray-400">Retention pattern by length</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-400">
            Channel videos: <span className="text-gray-300">{totalAvailable || '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">Analyze</label>
            <input
              type="number"
              min={1}
              max={20}
              value={limit}
              onChange={(e) => onLimitChange && onLimitChange(parseInt(e.target.value || '0'))}
              className="w-20 bg-gray-800 text-gray-200 text-xs rounded px-2 py-1 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-youtube-red"
            />
            {showPro && (
              <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-500 border border-gray-700">
                Pro
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="text-xs text-gray-400">Duration filter (minutes)</div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Min</label>
          <input
            type="number"
            min={0}
            value={minMinutes}
            onChange={(e) => setMinMinutes(parseInt(e.target.value || '0'))}
            className="w-16 bg-gray-800 text-gray-200 text-xs rounded px-2 py-1 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-youtube-red"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Max</label>
          <input
            type="number"
            min={0}
            value={maxMinutes}
            onChange={(e) => setMaxMinutes(parseInt(e.target.value || '0'))}
            className="w-16 bg-gray-800 text-gray-200 text-xs rounded px-2 py-1 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-youtube-red"
          />
        </div>
        <div className="text-xs text-gray-500">
          Selected: {normalizedMin}-{normalizedMax} min
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="bg-gray-800 rounded-lg border border-gray-700 h-72 flex items-center justify-center">
          <p className="text-gray-400 text-sm">No videos in selected duration range</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height={300} minWidth={400}>
            <ScatterChart>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="durationSeconds"
                name="Duration"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                domain={[minSeconds, maxSeconds]}
                tickFormatter={(value) => {
                  const minutes = Math.round(value / 60)
                  return `${minutes}m`
                }}
              />
              <YAxis
                type="number"
                dataKey="views"
                name="Views"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={filtered} fill="#ef4444" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
