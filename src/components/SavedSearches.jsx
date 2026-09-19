import { useState } from 'react'

export default function SavedSearches({
  savedSearches = [],
  activeSavedSearch,
  defaultSuggestedName = 'Custom Search',
  onSelectSavedSearch,
  onDeleteSavedSearch,
  onSaveCurrentSearch
}) {
  const [isCreating, setIsCreating] = useState(false)
  const [searchName, setSearchName] = useState('')

  const handleStartSave = () => {
    setSearchName(defaultSuggestedName)
    setIsCreating(true)
  }

  const handleConfirmSave = (e) => {
    e.preventDefault()
    if (searchName.trim()) {
      onSaveCurrentSearch(searchName.trim())
      setIsCreating(false)
      setSearchName('')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-400 uppercase">
        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
        <span>SAVED SMART SEARCHES:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {savedSearches.map((preset) => {
          const isActive = activeSavedSearch === preset.id
          return (
            <div
              key={preset.id}
              onClick={() => onSelectSavedSearch(preset.id)}
              className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer select-none ${
                isActive
                  ? 'bg-blue-600/30 border-blue-500 text-blue-200 ring-2 ring-blue-500/50'
                  : 'bg-[#152033]/80 border-slate-700/60 text-slate-300 hover:bg-[#1e2d47] hover:border-slate-600'
              }`}
            >
              {preset.icon === 'error' && (
                <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {preset.icon === 'time' && (
                <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {preset.icon === 'check' && (
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {preset.icon === 'help' && (
                <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {(!preset.icon || preset.icon === 'filter') && (
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              <span>{preset.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteSavedSearch(preset.id)
                }}
                className="ml-0.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-full w-4 h-4 flex items-center justify-center transition-colors text-[11px] leading-none cursor-pointer"
                title="Delete saved search"
                aria-label={`Delete ${preset.name}`}
              >
                ✕
              </button>
            </div>
          )
        })}

        {isCreating ? (
          <form
            onSubmit={handleConfirmSave}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#0f172a] border border-blue-500 ring-2 ring-blue-500/30"
          >
            <input
              type="text"
              autoFocus
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Name search..."
              className="bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none px-1.5 py-0.5 w-36 md:w-48 font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsCreating(false)
                  setSearchName('')
                }
              }}
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-colors shadow-sm cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false)
                setSearchName('')
              }}
              className="p-1 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
              title="Cancel"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            onClick={handleStartSave}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 bg-blue-950/40 border border-blue-800/50 hover:bg-blue-900/40 hover:border-blue-700 transition-colors cursor-pointer"
          >
            <span>+</span>
            <span>Save Current Search</span>
          </button>
        )}
      </div>
    </div>
  )
}
