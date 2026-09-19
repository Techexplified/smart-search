import { useState } from 'react'

export default function CardList({ cards, sortBy, onSortByChange, onOpenCard }) {
  const [selectedCardIds, setSelectedCardIds] = useState([])

  const isAllSelected = cards.length > 0 && selectedCardIds.length === cards.length

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCardIds([])
    } else {
      setSelectedCardIds(cards.map(c => c.id))
    }
  }

  const handleToggleSelectCard = (id) => {
    if (selectedCardIds.includes(id)) {
      setSelectedCardIds(selectedCardIds.filter(cardId => cardId !== id))
    } else {
      setSelectedCardIds([...selectedCardIds, id])
    }
  }

  return (
    <div className="space-y-4">
      {/* Results Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-800 text-sm">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleToggleSelectAll}
              className="w-4 h-4 rounded bg-[#162238] border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span>Select All</span>
          </label>

          <span className="text-slate-400 border-l border-slate-800 pl-4">
            <strong className="text-slate-100 font-semibold">{cards.length}</strong> matching cards
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>Sort by:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="bg-[#121c2e] border border-slate-700/80 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="Due Date (Earliest / Overdue)">Due Date (Earliest / Overdue)</option>
            <option value="Priority">Priority</option>
            <option value="Name">Card Name</option>
          </select>
        </div>
      </div>

      {/* Card List Items */}
      {cards.length === 0 ? (
        <div className="text-center py-16 bg-[#0f172a]/40 border border-slate-800/80 rounded-xl space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-slate-200 font-semibold">No matching cards found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing Deep Filters, or choosing a different board preset.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card) => {
            const isSelected = selectedCardIds.includes(card.id)

            return (
              <div
                key={card.id}
                className={`group relative bg-[#0f172a]/90 border rounded-xl p-4 transition-all duration-200 hover:border-slate-600 hover:shadow-xl ${
                  isSelected
                    ? 'border-blue-500/70 bg-blue-950/20 ring-1 ring-blue-500/30'
                    : 'border-slate-800/90'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Card Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelectCard(card.id)}
                    className="mt-1 w-4 h-4 rounded bg-[#162238] border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />

                  {/* Card Body */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Header Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Board Tag */}
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                        {card.board}
                      </span>

                      <span className="text-slate-600">•</span>

                      {/* List Badge */}
                      <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[11px] font-medium border border-slate-700/60">
                        {card.list}
                      </span>

                      {/* Priority Tag */}
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          card.priority.includes('High') || card.priority.includes('Urgent')
                            ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                            : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {card.priority}
                      </span>

                      {/* Due Date Tag */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          card.isOverdue
                            ? 'bg-red-950/40 text-red-400 border-red-800/50'
                            : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
                        }`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{card.dueDate}</span>
                      </span>

                      {/* Checklist Badge if exists */}
                      {card.checklistText && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-800/50 text-[11px]">
                          <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 022 2h2a2 2 0 022-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          <span>{card.checklistText}</span>
                        </span>
                      )}
                    </div>

                    {/* Title (Clickable) */}
                    <h3
                      onClick={() => onOpenCard && onOpenCard(card)}
                      className="text-base font-bold text-slate-100 hover:text-blue-400 transition-colors cursor-pointer inline-block"
                    >
                      {card.title}
                    </h3>

                    {/* Description */}
                    {card.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {card.description}
                      </p>
                    )}

                    {/* Footer Row with Labels & Action */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      {/* Label Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {card.labels.map((lbl) => (
                          <span
                            key={lbl}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#162238] text-slate-300 border border-slate-700/70"
                          >
                            {lbl}
                          </span>
                        ))}
                      </div>

                      {/* Assigned Avatar & Details Button */}
                      <div className="flex items-center gap-3 ml-auto">
                        {card.avatar && (
                          <img
                            src={card.avatar}
                            alt="Assigned Member"
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
                          />
                        )}

                        <button
                          onClick={() => onOpenCard && onOpenCard(card)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold text-blue-400 hover:text-white bg-blue-950/40 hover:bg-blue-600 border border-blue-800/50 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Details</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
