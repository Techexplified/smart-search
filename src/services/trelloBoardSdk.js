// Zero-Auth Native Trello Board SDK Service
// Fetches cards, lists, members, labels, and checklists directly from the open board with 0 authorization needed.

export async function fetchCurrentBoardCards(t) {
  if (!t || typeof t.cards !== 'function') {
    return []
  }

  try {
    // Fetch all cards on the current board
    const cards = await t.cards('all')

    return cards.map((card) => {
      const isOverdue = card.due ? new Date(card.due) < new Date() && !card.dueComplete : false

      // Checklist stats from card badges or checklists array
      let checklistText = ''
      let hasIncompleteChecklist = false
      if (card.badges && card.badges.checkItems > 0) {
        checklistText = `${card.badges.checkItemsChecked}/${card.badges.checkItems} completed`
        if (card.badges.checkItemsChecked < card.badges.checkItems) {
          hasIncompleteChecklist = true
        }
      } else if (card.checklists && card.checklists.length > 0) {
        let totalItems = 0
        let completedItems = 0
        card.checklists.forEach(cl => {
          if (cl.checkItems) {
            totalItems += cl.checkItems.length
            completedItems += cl.checkItems.filter(item => item.state === 'complete').length
          }
        })
        if (totalItems > 0) {
          checklistText = `${completedItems}/${totalItems} completed`
          if (completedItems < totalItems) {
            hasIncompleteChecklist = true
          }
        }
      }

      // Priority calculation from label names
      let priority = 'Normal'
      const highLabel = card.labels?.find(l => l.name?.toLowerCase().includes('high') || l.name?.toLowerCase().includes('urgent'))
      if (highLabel) {
        priority = highLabel.name
      }

      // Member extraction
      const assignedMembers = card.members?.map(m => m.username || m.fullName || m.id) || []
      const primaryMember = card.members?.[0]
      const avatar = primaryMember?.avatar || primaryMember?.avatarUrl ? (primaryMember.avatarUrl || `${primaryMember.avatar}/50.png`) : null

      return {
        id: card.id,
        title: card.name || 'Untitled Card',
        description: card.desc || '',
        board: card.board?.name || 'Current Board',
        list: card.list?.name || 'Board List',
        priority,
        dueDate: card.due ? new Date(card.due).toISOString().split('T')[0] : 'No Due Date',
        isOverdue,
        hasIncompleteChecklist,
        checklistText,
        assignedMembers,
        labels: card.labels?.map(l => l.name).filter(Boolean) || [],
        status: card.closed ? 'Archived' : 'Active',
        avatar,
        url: card.url
      }
    })
  } catch (err) {
    console.error('Error fetching cards via Trello SDK:', err)
    return []
  }
}
