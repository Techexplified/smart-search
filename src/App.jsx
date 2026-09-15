import { useState, useEffect, useMemo, useCallback } from 'react'
import SavedSearches from './components/SavedSearches'
import SearchBar from './components/SearchBar'
import DeepFilters from './components/DeepFilters'
import CardList from './components/CardList'
import { initTrelloPowerUp, getTrelloContext } from './trelloPowerUp'
import { fetchCurrentBoardCards } from './services/trelloBoardSdk'
import { MOCK_CARDS } from './data/mockCards'
import { filterCards } from './services/trelloApi'

// Initialize Trello Power-Up hooks if loaded inside Trello
initTrelloPowerUp()

export default function App() {
  const [tContext] = useState(() => getTrelloContext())
  const [isLoadingCards, setIsLoadingCards] = useState(true)
  const [boardCards, setBoardCards] = useState([])

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

  // Load cards directly from Trello Power-Up SDK (Zero Auth Needed)
  const loadCards = useCallback(async () => {
    try {
      if (tContext) {
        const fetchedCards = await fetchCurrentBoardCards(tContext)
        if (fetchedCards && fetchedCards.length > 0) {
          setBoardCards(fetchedCards)
        } else {
          setBoardCards(MOCK_CARDS)
        }
      } else {
        setBoardCards(MOCK_CARDS)
      }
    } catch {
      setBoardCards(MOCK_CARDS)
    } finally {
      setIsLoadingCards(false)
    }
  }, [tContext])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCards()
    }, 0)
    return () => clearTimeout(timer)
  }, [loadCards])

  // Apply filtering logic to board cards
  const filteredCards = useMemo(() => {
    return filterCards(boardCards, {
      query,
      quickFilter,
      ...filterState
    })
  }, [boardCards, query, quickFilter, filterState])

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
              <p className="text-[11px] text-slate-400">Instant search & deep filter for board cards</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsLoadingCards(true)
                loadCards()
              }}
              disabled={isLoadingCards}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors flex items-center gap-1"
              title="Refresh Board Cards"
            >
              🔄 Refresh
            </button>
          </div>
        </header>

        {/* Loading Indicator */}
        {isLoadingCards ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400">Loading cards from your Trello board...</p>
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
