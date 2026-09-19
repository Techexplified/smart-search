import { QUICK_SEARCH_CHIPS } from '../data/mockCards'

export default function SearchBar({ query, onQueryChange, matchCount, onSelectQuickChip }) {
  return (
    <div className="space-y-3 mb-6">
      {/* Search Input Box */}
      <div className="relative flex items-center w-full bg-[#121c2e] border border-slate-700/70 rounded-xl shadow-lg px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        <svg
          className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search cards across your boards... (e.g. 'Client Approval', 'Homepage', 'Acme')"
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
        />

        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="text-slate-400 hover:text-slate-200 mr-2 text-xs cursor-pointer"
          >
            ✕
          </button>
        )}

        <span className="ml-3 px-3 py-1 text-xs font-semibold text-blue-300 bg-blue-900/40 border border-blue-700/50 rounded-full whitespace-nowrap">
          {matchCount} {matchCount === 1 ? 'card' : 'cards'}
        </span>
      </div>

      {/* Quick Search Suggestions */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Quick search:</span>
        </span>
        {QUICK_SEARCH_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => onSelectQuickChip(chip)}
            className="px-2.5 py-1 rounded-md bg-[#162238] border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-500 transition-colors cursor-pointer"
          >
            "{chip}"
          </button>
        ))}
      </div>
    </div>
  )
}
