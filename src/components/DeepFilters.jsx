import {
  AVAILABLE_BOARDS,
  AVAILABLE_LISTS,
  AVAILABLE_MEMBERS,
  AVAILABLE_LABELS
} from '../data/mockCards'

export default function DeepFilters({
  isExpanded,
  onToggleExpanded,
  quickFilter,
  onSelectQuickFilter,
  filterState,
  onFilterChange,
  onToggleLabel
}) {
  const {
    board,
    list,
    member,
    dueDate,
    priority,
    checklistStatus,
    selectedLabels,
    status
  } = filterState

  return (
    <div className="bg-[#0f172a]/70 border border-slate-800 rounded-xl p-4 mb-6 space-y-4">
      {/* Header Bar with Deep Filters Toggle & Quick Pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onToggleExpanded}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            isExpanded
              ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/20'
              : 'bg-[#1e293b] border-slate-700 text-slate-200 hover:bg-slate-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>{isExpanded ? 'Hide Deep Filters' : 'Deep Filters'}</span>
          <span className="text-[10px]">{isExpanded ? '▲' : '▼'}</span>
        </button>

        {/* Quick Pills */}
        <button
          onClick={() => onSelectQuickFilter(quickFilter === 'me' ? null : 'me')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
            quickFilter === 'me'
              ? 'bg-purple-900/60 border-purple-500 text-purple-200'
              : 'bg-[#182235] border-slate-700/70 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span>Me</span>
        </button>

        <button
          onClick={() => onSelectQuickFilter(quickFilter === 'highPriority' ? null : 'highPriority')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
            quickFilter === 'highPriority'
              ? 'bg-amber-900/60 border-amber-500 text-amber-200'
              : 'bg-[#182235] border-slate-700/70 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>High Priority</span>
        </button>

        <button
          onClick={() => onSelectQuickFilter(quickFilter === 'overdue' ? null : 'overdue')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
            quickFilter === 'overdue'
              ? 'bg-red-900/60 border-red-500 text-red-200'
              : 'bg-[#182235] border-slate-700/70 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Overdue</span>
        </button>

        <button
          onClick={() => onSelectQuickFilter(quickFilter === 'incompleteChecklist' ? null : 'incompleteChecklist')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
            quickFilter === 'incompleteChecklist'
              ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
              : 'bg-[#182235] border-slate-700/70 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span>Incomplete Checklist</span>
        </button>
      </div>

      {/* Expanded Deep Filters Dropdowns & Tags */}
      {isExpanded && (
        <div className="pt-3 border-t border-slate-800 space-y-4 animate-fadeIn">
          {/* Dropdowns Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* Board Dropdown */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span>Board</span>
              </label>
              <select
                value={board}
                onChange={(e) => onFilterChange('board', e.target.value)}
                className="w-full bg-[#182235] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="All Boards">All Boards</option>
                {AVAILABLE_BOARDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* List Dropdown */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>List</span>
              </label>
              <select
                value={list}
                onChange={(e) => onFilterChange('list', e.target.value)}
                className="w-full bg-[#182235] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="All Lists">All Lists</option>
                {AVAILABLE_LISTS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Member Dropdown */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Member</span>
              </label>
              <select
                value={member}
                onChange={(e) => onFilterChange('member', e.target.value)}
                className="w-full bg-[#182235] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="All Members">All Members</option>
                {AVAILABLE_MEMBERS.map((m) => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Due Date Dropdown */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Due Date</span>
              </label>
              <select
                value={dueDate}
                onChange={(e) => onFilterChange('dueDate', e.target.value)}
                className="w-full bg-[#182235] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="Any Due Date">Any Due Date</option>
                <option value="Overdue">Overdue</option>
                <option value="Due This Week">Due This Week</option>
              </select>
            </div>

            {/* Priority Dropdown */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                <span>Priority</span>
              </label>
              <select
                value={priority}
                onChange={(e) => onFilterChange('priority', e.target.value)}
                className="w-full bg-[#182235] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="All Priorities">All Priorities</option>
                <option value="High Priority">High Priority</option>
                <option value="Medium">Medium</option>
                <option value="Urgent">Urgent</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Checklist Status Dropdown */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Checklist Status</span>
              </label>
              <select
                value={checklistStatus}
                onChange={(e) => onFilterChange('checklistStatus', e.target.value)}
                className="w-full bg-[#182235] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="Any Checklist Status">Any Checklist Status</option>
                <option value="Incomplete">Incomplete Checklist</option>
                <option value="Complete">Completed Checklist</option>
              </select>
            </div>
          </div>

          {/* Labels & Status Segmented Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
            {/* Multi-select Labels */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Labels:</span>
              </span>
              {AVAILABLE_LABELS.map((lbl) => {
                const isSelected = selectedLabels.includes(lbl)
                return (
                  <button
                    key={lbl}
                    onClick={() => onToggleLabel(lbl)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/40 border-blue-400 text-blue-100 ring-1 ring-blue-400'
                        : 'bg-[#182235] border-slate-700/70 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {lbl}
                  </button>
                )
              })}
            </div>

            {/* Status Toggle Segmented Control */}
            <div className="flex items-center gap-2 text-xs flex-shrink-0">
              <span className="text-slate-400 font-medium">Status:</span>
              <div className="inline-flex rounded-lg bg-[#121a28] p-1 border border-slate-800">
                {['Active', 'Archived', 'All'].map((st) => (
                  <button
                    key={st}
                    onClick={() => onFilterChange('status', st)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      status === st
                        ? 'bg-slate-700 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
