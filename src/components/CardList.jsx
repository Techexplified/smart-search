import { useState } from 'react'

export default function CardList({ cards, sortBy, onSortByChange }) {
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
              className="w-4 h-4 rounded bg-[#162238] border-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <span>Select All</span>
          </label>

          <span className="text-slate-400 border-l border-slate-800 pl-4">
            <strong className="text-slate-100 font-semibold">{cards.length}</strong> matching cards
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <span>⇅</span> Sort by:
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
          <div className="text-4xl">🔍</div>
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
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
                            : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
                        }`}
                      >
                        <span>✓</span>
                        <span>{card.dueDate}</span>
                      </span>

                      {/* Checklist Badge if exists */}
                      {card.checklistText && (
                        <span className="px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-800/50 text-[11px]">
                          📋 {card.checklistText}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
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

                        <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                          Details →
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
