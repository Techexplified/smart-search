export default function SavedSearches({
  savedSearches = [],
  activeSavedSearch,
  onSelectSavedSearch,
  onDeleteSavedSearch,
  onSaveCurrentSearch
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-400 uppercase">
        <span className="text-amber-400 text-sm">✨</span>
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
                <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[10px] font-bold">!</span>
              )}
              {preset.icon === 'time' && (
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">🕒</span>
              )}
              {preset.icon === 'check' && (
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</span>
              )}
              {preset.icon === 'help' && (
                <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">?</span>
              )}
              {(!preset.icon || preset.icon === 'filter') && (
                <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">🔍</span>
              )}
              <span>{preset.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteSavedSearch(preset.id)
                }}
                className="ml-0.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-full w-4 h-4 flex items-center justify-center transition-colors text-[11px] leading-none"
                title="Delete saved search"
                aria-label={`Delete ${preset.name}`}
              >
                ✕
              </button>
            </div>
          )
        })}

        <button
          onClick={onSaveCurrentSearch}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 bg-blue-950/40 border border-blue-800/50 hover:bg-blue-900/40 hover:border-blue-700 transition-colors"
        >
          <span>+</span>
          <span>Save Current Search</span>
        </button>
      </div>
    </div>
  )
}
