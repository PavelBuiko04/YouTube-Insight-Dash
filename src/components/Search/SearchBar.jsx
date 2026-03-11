import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'

const QUICK_FILTERS = [
  { label: 'Trending', query: 'trending' },
  { label: 'Tech', query: 'technology' },
  { label: 'Education', query: 'educational' },
  { label: 'Music', query: 'music' },
  { label: 'Gaming', query: 'gaming' },
]

export default function SearchBar({ onSearch, isLoading }) {
  const [searchInput, setSearchInput] = useState('')
  const debouncedValue = useDebounce(searchInput, 500)

  // Trigger search on debounced value change
  useEffect(() => {
    if (debouncedValue) {
      onSearch(debouncedValue)
    }
  }, [debouncedValue, onSearch])

  const handleInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  const handleQuickFilter = (query) => {
    setSearchInput(query)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      onSearch(searchInput)
    }
  }

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for videos by keyword..."
            value={searchInput}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-youtube-red focus:ring-1 focus:ring-youtube-red text-white placeholder-gray-500 transition"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-youtube-red w-5 h-5 animate-spin" />
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-youtube-red hover:bg-red-600 text-white font-semibold rounded-lg transition"
        >
          Search
        </button>
      </form>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((filter) => (
          <button
            key={filter.query}
            onClick={() => handleQuickFilter(filter.query)}
            className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full border border-gray-700 transition"
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
