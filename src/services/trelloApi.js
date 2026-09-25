import { MOCK_CARDS } from '../data/mockCards'

export function filterCards(cards = MOCK_CARDS, filterState = {}) {
  const {
    query = '',
    quickFilter = null, // 'me' | 'highPriority' | 'overdue' | 'incompleteChecklist' | null
    board = 'All Boards',
    list = 'All Lists',
    member = 'All Members',
    dueDate = 'Any Due Date',
    priority = 'All Priorities',
    checklistStatus = 'Any Checklist Status',
    selectedLabels = [],
    status = 'Active', // 'Active' | 'Archived' | 'All'
    sortBy = 'Due Date (Earliest / Overdue)'
  } = filterState

  return cards.filter(card => {
    // Status filter
    if (status !== 'All' && card.status !== status) {
      return false
    }

    // Keyword Query Search (matches title, description, board, list, or labels)
    if (query.trim()) {
      const q = query.toLowerCase()
      const matchTitle = (card.title || '').toLowerCase().includes(q)
      const matchDesc = (card.description || '').toLowerCase().includes(q)
      const matchBoard = (card.board || '').toLowerCase().includes(q)
      const matchList = (card.list || '').toLowerCase().includes(q)
      const matchLabels = (card.labels || []).some(l => (l || '').toLowerCase().includes(q))

      if (!matchTitle && !matchDesc && !matchBoard && !matchList && !matchLabels) {
        return false
      }
    }

    // Quick filter pills
    if (quickFilter === 'me' && !card.assignedMembers.includes('me')) {
      return false
    }
    if (quickFilter === 'highPriority' && !card.priority.toLowerCase().includes('high') && !card.priority.toLowerCase().includes('urgent')) {
      return false
    }
    if (quickFilter === 'overdue' && !card.isOverdue) {
      return false
    }
    if (quickFilter === 'incompleteChecklist' && !card.hasIncompleteChecklist) {
      return false
    }

    // Deep Filter: Board
    if (board !== 'All Boards' && card.board !== board) {
      return false
    }

    // Deep Filter: List
    if (list !== 'All Lists' && card.list !== list) {
      return false
    }

    // Deep Filter: Member
    if (member !== 'All Members') {
      if (member === 'Me' && !card.assignedMembers.includes('me')) return false
      if (member !== 'Me' && !card.assignedMembers.includes(member.toLowerCase())) return false
    }

    // Deep Filter: Due Date
    if (dueDate !== 'Any Due Date') {
      if (dueDate === 'Overdue' && !card.isOverdue) return false
    }

    // Deep Filter: Priority
    if (priority !== 'All Priorities' && !card.priority.toLowerCase().includes(priority.toLowerCase())) {
      return false
    }

    // Deep Filter: Checklist Status
    if (checklistStatus !== 'Any Checklist Status') {
      if (checklistStatus === 'Incomplete' && !card.hasIncompleteChecklist) return false
      if (checklistStatus === 'Complete' && card.hasIncompleteChecklist) return false
    }

    // Deep Filter: Selected Labels
    if (selectedLabels.length > 0) {
      const hasSelectedLabel = selectedLabels.some(l => card.labels.includes(l))
      if (!hasSelectedLabel) return false
    }

    return true
  }).sort((a, b) => {
    if (sortBy.includes('Due Date')) {
      if (a.isOverdue && !b.isOverdue) return -1
      if (!a.isOverdue && b.isOverdue) return 1
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (sortBy.includes('Priority')) {
      return a.priority.localeCompare(b.priority)
    }
    if (sortBy.includes('Name')) {
      return a.title.localeCompare(b.title)
    }
    return 0
  })
}
