import { IS_DEMO_MODE } from '../../api/youtubeApi'

export default function VideoPlayer({ videoId }) {
  if (IS_DEMO_MODE) {
    return (
      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800">
        <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center">
          {/* Blurred background */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-xl opacity-50"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800)',
            }}
          />
          
          {/* Content overlay */}
          <div className="relative z-10 text-center px-8">
            <div className="mb-4 text-6xl opacity-50">▶</div>
            <h3 className="text-2xl font-bold text-white mb-2">Demo Preview</h3>
            <p className="text-gray-400 mb-6">This is how the video player will look like</p>
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 max-w-sm mx-auto">
              <p className="text-white font-semibold mb-3">To use the app:</p>
              <ol className="text-white text-sm text-left space-y-2">
                <li>1. Download this project</li>
                <li>2. Get a YouTube API key from Google Cloud Console</li>
                <li>3. Create .env.local with your API key</li>
                <li>4. Run: npm install && npm run dev</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video player"
        className="w-full h-full"
      />
    </div>
  )
}
