import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import SearchBar from './components/Search/SearchBar'
import VideoPlayer from './components/Video/VideoPlayer'
import VideoList from './components/Video/VideoList'
import AnalyticsPanel from './components/Analytics/AnalyticsPanel'
import ComparisonChart from './components/Charts/ComparisonChart'
import EngagementChart from './components/Charts/EngagementChart'
import DurationViewsChart from './components/Charts/DurationViewsChart'
import { searchVideos, getVideoDetails, getVideoStatistics, searchVideosByChannel, IS_DEMO_MODE } from './api/youtubeApi'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideoId, setSelectedVideoId] = useState('')
  const [videosList, setVideosList] = useState([])
  const [videosWithStats, setVideosWithStats] = useState([])
  const [channelVideos, setChannelVideos] = useState([])
  const [durationLimit, setDurationLimit] = useState(5)
  const [durationPro, setDurationPro] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const exportRef = useRef(null)

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

  // Fetch videos from same channel as selected video
  const { data: channelSearchResults } = useQuery({
    queryKey: ['channelVideos', videoDetails?.snippet.channelId],
    queryFn: () => searchVideosByChannel(videoDetails?.snippet.channelId),
    enabled: Boolean(videoDetails?.snippet.channelId),
    staleTime: 1000 * 60 * 10,
  })

  // Fetch stats for comparison videos (from same channel)
  const statsLimit = Math.max(5, durationLimit)
  const { data: comparisonStats } = useQuery({
    queryKey: ['videoStats', channelVideos.slice(0, statsLimit).map(v => v.id.videoId).join(',')],
    queryFn: () => {
      const ids = channelVideos.slice(0, statsLimit).map(v => v.id.videoId)
      return getVideoStatistics(ids)
    },
    enabled: channelVideos.length > 0,
  })

  // Merge search data with statistics for comparison
  useEffect(() => {
    if (comparisonStats && comparisonStats.length > 0) {
      setVideosWithStats(comparisonStats)
    }
  }, [comparisonStats])

  // Update channel videos when channel search results arrive
  useEffect(() => {
    if (channelSearchResults?.items) {
      // Exclude the currently selected video from comparison
      const filtered = channelSearchResults.items.filter(v => v.id.videoId !== selectedVideoId)
      setChannelVideos(filtered)
    }
  }, [channelSearchResults, selectedVideoId])

  // Update video list when search results arrive
  useEffect(() => {
    if (searchData?.items) {
      setVideosList(searchData.items)
      if (!selectedVideoId && searchData.items.length > 0) {
        setSelectedVideoId(searchData.items[0].id.videoId)
      }
    }
  }, [searchData])

  // Initialize demo mode on mount
  useEffect(() => {
    if (IS_DEMO_MODE && !searchQuery && !selectedVideoId) {
      // Trigger demo search with a default query
      setSearchQuery('web development tutorial')
    }
  }, [])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleVideoSelect = (videoId) => {
    setSelectedVideoId(videoId)
  }

  const handleDurationLimitChange = (value) => {
    const next = Number.isFinite(value) ? Math.floor(value) : 0
    if (next > 20) {
      setDurationPro(true)
      return
    }
    setDurationPro(false)
    if (next >= 1) {
      setDurationLimit(next)
    }
  }

  const handleExportPdf = async () => {
    if (!exportRef.current || isExporting) return
    setIsExporting(true)
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0b0b0b',
        scrollY: -window.scrollY,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgProps = pdf.getImageProperties(imgData)
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight)
      heightLeft -= pdfHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight)
        heightLeft -= pdfHeight
      }

      const date = new Date().toISOString().slice(0, 10)
      pdf.save(`youtube-insight-${date}.pdf`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-youtube-dark via-gray-900 to-black">
      {/* Demo Mode Banner */}
      {IS_DEMO_MODE && (
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-700 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="text-blue-200 font-semibold">Demo Mode Active</div>
            <div className="text-blue-300 text-sm flex-1">
              You're viewing sample data. To use your own videos, configure your YouTube API key.
            </div>
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded whitespace-nowrap"
            >
              Get API Key
            </a>
          </div>
        </div>
      )}
      
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
            <button
              onClick={handleExportPdf}
              disabled={!selectedVideoId || isExporting}
              className={`text-xs px-3 py-1 rounded-full border ${
                !selectedVideoId || isExporting
                  ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                  : 'bg-gray-900 text-gray-200 border-gray-700 hover:bg-gray-800'
              }`}
            >
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>
      </header>

      {/* Main Content */}
      <div ref={exportRef} className="max-w-7xl mx-auto px-4 py-6">
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
                  similarVideos={videosWithStats} 
                />
              )}

              {/* Charts Section */}
              {videoDetails && videosWithStats.length > 0 && (
                <div className="space-y-6">
                  <ComparisonChart 
                    videos={videosWithStats} 
                    onVideoClick={handleVideoSelect}
                  />
                  <DurationViewsChart
                    videos={videosWithStats}
                    totalAvailable={channelSearchResults?.pageInfo?.totalResults || channelVideos.length}
                    limit={durationLimit}
                    showPro={durationPro}
                    onLimitChange={handleDurationLimitChange}
                  />
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
