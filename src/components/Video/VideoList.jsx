import { Loader2 } from 'lucide-react'

const VideoSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-3 p-3 bg-gray-800 rounded-lg">
        <div className="skeleton w-24 h-16 flex-shrink-0 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded"></div>
          <div className="skeleton h-3 w-1/2 rounded"></div>
        </div>
      </div>
    ))}
  </div>
)

export default function VideoList({ videos, selectedVideoId, onSelectVideo, isLoading }) {
  if (isLoading || !videos) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Search Results</h3>
        <VideoSkeleton />
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 max-h-[800px] overflow-y-auto">
      <h3 className="text-lg font-semibold text-white mb-4">Search Results ({videos.length})</h3>
      <div className="space-y-2">
        {videos.map((video) => {
          const videoId = video.id?.videoId
          const snippet = video.snippet
          const thumbnail = snippet?.thumbnails?.default?.url || snippet?.thumbnails?.medium?.url
          
          if (!videoId || !snippet) return null
          
          return (
            <button
              key={videoId}
              onClick={() => onSelectVideo(videoId)}
              className={`w-full p-3 rounded-lg text-left transition cursor-pointer ${
                selectedVideoId === videoId
                  ? 'bg-youtube-red bg-opacity-20 border border-youtube-red'
                  : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative mb-2 overflow-hidden rounded bg-black">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={snippet.title}
                    className="w-full h-auto aspect-video object-cover hover:opacity-80 transition"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500">No thumbnail</span>
                  </div>
                )}
                {selectedVideoId === videoId && (
                  <div className="absolute inset-0 bg-youtube-red bg-opacity-30"></div>
                )}
              </div>

              {/* Title */}
              <h4 className="text-sm font-semibold text-white line-clamp-2 hover:text-youtube-red transition">
                {snippet.title}
              </h4>

              {/* Channel */}
              <p className="text-xs text-gray-400 mt-1">{snippet.channelTitle}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
