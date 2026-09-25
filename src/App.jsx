import { useState, useEffect, useMemo, useCallback } from 'react'
import SavedSearches from './components/SavedSearches'
import SearchBar from './components/SearchBar'
import DeepFilters from './components/DeepFilters'
import CardList from './components/CardList'
import { getTrelloContext } from './trelloPowerUp'
import { fetchCurrentBoardCards } from './services/trelloBoardSdk'
import { MOCK_CARDS, SAVED_SEARCHES } from './data/mockCards'
import { filterCards } from './services/trelloApi'

const INITIAL_FILTER_STATE = {
  board: 'All Boards',
  list: 'All Lists',
  member: 'All Members',
  dueDate: 'Any Due Date',
  priority: 'All Priorities',
  checklistStatus: 'Any Checklist Status',
  selectedLabels: [],
  status: 'Active',
  sortBy: 'Due Date (Earliest / Overdue)'
}

export default function App() {
  const [tContext] = useState(() => getTrelloContext())
  const [isLoadingCards, setIsLoadingCards] = useState(true)
  const [boardCards, setBoardCards] = useState([])

  // Search & Filter State
  const [savedSearches, setSavedSearches] = useState(SAVED_SEARCHES)
  const [activeSavedSearch, setActiveSavedSearch] = useState(null)
  const [query, setQuery] = useState('')
  const [quickFilter, setQuickFilter] = useState(null)
  const [isDeepFiltersExpanded, setIsDeepFiltersExpanded] = useState(false)

  const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE)

  // Load cards directly from Trello Power-Up SDK
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

  // Open / Redirect to selected Trello card
  const handleOpenCard = (card) => {
    if (tContext && typeof tContext.showCard === 'function') {
      try {
        tContext.showCard(card.id)
        return
      } catch {
        // Fallback below
      }
    }
    if (card.url) {
      window.open(card.url, '_blank')
    }
  }

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
      setQuery('')
      setQuickFilter(null)
      setFilterState(INITIAL_FILTER_STATE)
      return
    }

    const targetPreset = savedSearches.find(s => s.id === presetId)
    if (!targetPreset) return

    setActiveSavedSearch(presetId)
    const criteria = targetPreset.criteria || {}
    setQuery(criteria.query || '')
    setQuickFilter(criteria.quickFilter || null)
    setFilterState({
      ...INITIAL_FILTER_STATE,
      ...(criteria.filterState || {})
    })
  }

  const handleDeleteSavedSearch = (presetId) => {
    setSavedSearches(prev => prev.filter(s => s.id !== presetId))
    if (activeSavedSearch === presetId) {
      setActiveSavedSearch(null)
    }
  }

  const defaultSuggestedName = useMemo(() => {
    if (query) return `Query: ${query}`
    if (quickFilter) return `Filter: ${quickFilter}`
    if (filterState.priority !== 'All Priorities') return filterState.priority
    if (filterState.list !== 'All Lists') return filterState.list
    return 'Custom Search'
  }, [query, quickFilter, filterState])

  const handleSaveCurrentSearch = (presetName) => {
    if (!presetName || !presetName.trim()) return

    const newPreset = {
      id: `custom-${Date.now()}`,
      name: presetName.trim(),
      icon: 'filter',
      color: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
      criteria: {
        query,
        quickFilter,
        filterState: { ...filterState }
      }
    }

    setSavedSearches(prev => [...prev, newPreset])
    setActiveSavedSearch(newPreset.id)
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
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Refresh Board Cards"
            >
              <svg className={`w-3.5 h-3.5 ${isLoadingCards ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
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
              savedSearches={savedSearches}
              activeSavedSearch={activeSavedSearch}
              defaultSuggestedName={defaultSuggestedName}
              onSelectSavedSearch={handleSelectSavedSearch}
              onDeleteSavedSearch={handleDeleteSavedSearch}
              onSaveCurrentSearch={handleSaveCurrentSearch}
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
              onOpenCard={handleOpenCard}
            />
          </>
        )}
      </div>
    </div>
  )
}
