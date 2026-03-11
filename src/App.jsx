import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import SearchBar from './components/Search/SearchBar'
import VideoPlayer from './components/Video/VideoPlayer'
import VideoList from './components/Video/VideoList'
import AnalyticsPanel from './components/Analytics/AnalyticsPanel'
import ComparisonChart from './components/Charts/ComparisonChart'
import EngagementChart from './components/Charts/EngagementChart'
import { searchVideos, getVideoDetails } from './api/youtubeApi'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideoId, setSelectedVideoId] = useState('')
  const [videosList, setVideosList] = useState([])

  // Fetch search results
  const { data: searchData, isLoading: isSearching } = useQuery({
    queryKey: ['videos', searchQuery],
    queryFn: () => searchVideos(searchQuery),
    enabled: searchQuery.length > 0,
    staleTime: 1000 * 60 * 10,
  })

  // Fetch detailed stats for selected video
  const { data: videoDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['videoDetails', selectedVideoId],
    queryFn: () => getVideoDetails(selectedVideoId),
    enabled: Boolean(selectedVideoId),
  })

  // Update video list when search results arrive
  useEffect(() => {
    if (searchData?.items) {
      setVideosList(searchData.items)
      if (!selectedVideoId && searchData.items.length > 0) {
        setSelectedVideoId(searchData.items[0].id.videoId)
      }
    }
  }, [searchData])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleVideoSelect = (videoId) => {
    setSelectedVideoId(videoId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-youtube-dark via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-youtube-red rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <h1 className="text-2xl font-bold text-white">YouTube Insight Dash</h1>
            <span className="ml-auto text-xs bg-youtube-red px-3 py-1 rounded-full text-white">
              Pro Analytics
            </span>
          </div>
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {searchQuery ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Player & Analytics */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                {selectedVideoId ? (
                  <VideoPlayer videoId={selectedVideoId} />
                ) : (
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    <p className="text-gray-400">Select a video to play</p>
                  </div>
                )}
              </div>

              {videoDetails && (
                <AnalyticsPanel 
                  video={videoDetails} 
                  similarVideos={videosList.slice(0, 5)} 
                />
              )}

              {/* Charts Section */}
              {videoDetails && (
                <div className="space-y-6">
                  <ComparisonChart videos={videosList.slice(0, 5)} />
                  <EngagementChart video={videoDetails} />
                </div>
              )}
            </div>

            {/* Video List */}
            <div className="lg:col-span-1">
              <VideoList 
                videos={videosList} 
                selectedVideoId={selectedVideoId}
                onSelectVideo={handleVideoSelect}
                isLoading={isSearching}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">YouTube Insight Dash</h2>
              <p className="text-xl text-gray-400">
                Professional video content analysis and KPI metrics
              </p>
              <p className="text-gray-500">
                Search for videos to begin analyzing engagement, SEO, and performance metrics
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
