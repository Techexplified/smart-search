import { useState, useEffect, useMemo, useCallback } from 'react'
import SavedSearches from './components/SavedSearches'
import SearchBar from './components/SearchBar'
import DeepFilters from './components/DeepFilters'
import CardList from './components/CardList'
import AuthScreen from './components/AuthScreen'
import { initTrelloPowerUp, getTrelloContext } from './trelloPowerUp'
import { getStoredToken, authorizeWithTrello, clearToken } from './services/trelloAuthService'
import { fetchLiveCards } from './services/trelloRealApi'
import { filterCards } from './services/trelloApi'

// Initialize Trello Power-Up hooks if loaded inside Trello
initTrelloPowerUp()

export default function App() {
  const [tContext] = useState(() => getTrelloContext())
  const [token, setToken] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [isLoadingCards, setIsLoadingCards] = useState(false)
  const [liveCards, setLiveCards] = useState([])

  // Search & Filter State
  const [activeSavedSearch, setActiveSavedSearch] = useState(null)
  const [query, setQuery] = useState('')
  const [quickFilter, setQuickFilter] = useState(null)
  const [isDeepFiltersExpanded, setIsDeepFiltersExpanded] = useState(false)

  const [filterState, setFilterState] = useState({
    board: 'All Boards',
    list: 'All Lists',
    member: 'All Members',
    dueDate: 'Any Due Date',
    priority: 'All Priorities',
    checklistStatus: 'Any Checklist Status',
    selectedLabels: [],
    status: 'Active',
    sortBy: 'Due Date (Earliest / Overdue)'
  })

  // Load cards from Trello REST API
  const loadCards = useCallback(async (userToken) => {
    const apiKey = import.meta.env.VITE_TRELLO_API_KEY
    if (!apiKey) return

    setIsLoadingCards(true)
    setAuthError(null)
    try {
      const cards = await fetchLiveCards(apiKey, userToken)
      setLiveCards(cards)
    } catch (err) {
      setAuthError(err.message || 'Error fetching live Trello cards.')
    } finally {
      setIsLoadingCards(false)
    }
  }, [])

  // Initialize Trello context and check stored token
  useEffect(() => {
    getStoredToken(tContext).then((storedToken) => {
      if (storedToken) {
        setToken(storedToken)
        loadCards(storedToken)
      }
    })
  }, [tContext, loadCards])

  // Handle User Click on Authorize
  const handleAuthorize = async (apiKeyOverride) => {
    setAuthError(null)
    const key = apiKeyOverride || import.meta.env.VITE_TRELLO_API_KEY
    try {
      const userToken = await authorizeWithTrello(tContext, key)
      setToken(userToken)
      await loadCards(userToken)
    } catch (err) {
      setAuthError(err.message || 'Authorization failed.')
    }
  }

  const handleLogout = async () => {
    await clearToken(tContext)
    setToken(null)
    setLiveCards([])
  }

  // Apply filtering logic to live Trello cards
  const filteredCards = useMemo(() => {
    return filterCards(liveCards, {
      query,
      quickFilter,
      ...filterState
    })
  }, [liveCards, query, quickFilter, filterState])

  // Preset & Filter Handlers
  const handleSelectSavedSearch = (presetId) => {
    if (activeSavedSearch === presetId) {
      setActiveSavedSearch(null)
      setQuickFilter(null)
      setFilterState(prev => ({ ...prev, priority: 'All Priorities', dueDate: 'Any Due Date' }))
      return
    }

    setActiveSavedSearch(presetId)
    if (presetId === 'overdue-high') {
      setQuickFilter('overdue')
      setFilterState(prev => ({ ...prev, priority: 'High Priority' }))
    } else if (presetId === 'waiting-client') {
      setQuery('Client')
    } else if (presetId === 'qa-pending') {
      setFilterState(prev => ({ ...prev, list: 'Under Review' }))
    } else if (presetId === 'unassigned-urgent') {
      setFilterState(prev => ({ ...prev, priority: 'Urgent' }))
    }
  }

  const handleSelectQuickChip = (chipText) => {
    setQuery(chipText)
  }

  const handleFilterChange = (key, value) => {
    setFilterState(prev => ({ ...prev, [key]: value }))
  }

  const handleToggleLabel = (labelName) => {
    setFilterState(prev => {
      const exists = prev.selectedLabels.includes(labelName)
      return {
        ...prev,
        selectedLabels: exists
          ? prev.selectedLabels.filter(l => l !== labelName)
          : [...prev.selectedLabels, labelName]
      }
    })
  }

  // Show AuthScreen if user is not authorized yet
  if (!token) {
    return <AuthScreen onAuthorize={handleAuthorize} error={authError} />
  }

  return (
    <div className="min-h-screen bg-[#090e17] text-slate-100 p-3 md:p-6 font-sans">
      <div className="max-w-full mx-auto space-y-4">
        {/* Modal / Floating Header */}
        <header className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-base">
              ⚡
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">Smart Search</h1>
              <p className="text-[11px] text-slate-400">Searching live cards across your workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadCards(token)}
              disabled={isLoadingCards}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors"
              title="Refresh Workspace Cards"
            >
              🔄
            </button>
            <button
              onClick={handleLogout}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline"
            >
              Disconnect
            </button>
          </div>
        </header>

        {/* Loading Indicator */}
        {isLoadingCards ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400">Loading cards from your Trello workspace...</p>
          </div>
        ) : (
          <>
            {/* Saved Smart Searches Bar */}
            <SavedSearches
              activeSavedSearch={activeSavedSearch}
              onSelectSavedSearch={handleSelectSavedSearch}
              onSaveCurrentSearch={() => alert(`Saved filter preset for query: "${query || 'All'}"`)}
            />

            {/* Search Input & Quick Chips */}
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              matchCount={filteredCards.length}
              onSelectQuickChip={handleSelectQuickChip}
            />

            {/* Deep Filters Panel */}
            <DeepFilters
              isExpanded={isDeepFiltersExpanded}
              onToggleExpanded={() => setIsDeepFiltersExpanded(!isDeepFiltersExpanded)}
              quickFilter={quickFilter}
              onSelectQuickFilter={setQuickFilter}
              filterState={filterState}
              onFilterChange={handleFilterChange}
              onToggleLabel={handleToggleLabel}
            />

            {/* Card Results List */}
            <CardList
              cards={filteredCards}
              sortBy={filterState.sortBy}
              onSortByChange={(val) => handleFilterChange('sortBy', val)}
            />
          </>
        )}
      </div>
    </div>
  )
}
