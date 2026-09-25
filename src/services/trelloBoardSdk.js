// Zero-Auth Native Trello Board SDK Service
// Fetches cards, lists, members, labels, and checklists directly from the open board with 0 authorization needed.

export async function fetchCurrentBoardCards(t) {
  if (!t) return []

  try {
    // Fetch cards, lists, and members in parallel using available SDK methods
    let cards = []
    let lists = []

    // Try t.cards() — available on the board iframe context
    if (typeof t.cards === 'function') {
      cards = await t.cards('all')
    } else if (typeof t.board === 'function') {
      // Fallback: get board data which includes cards
      const board = await t.board('cards', 'lists', 'members')
      cards = board.cards || []
      lists = board.lists || []
    }

    if (!cards || cards.length === 0) return []

    // Fetch lists separately to get list names (t.cards doesn't include list name)
    if (lists.length === 0 && typeof t.lists === 'function') {
      try {
        lists = await t.lists('all')
      } catch {
        lists = []
      }
    }

    // Build a quick lookup: listId → listName
    const listMap = {}
    lists.forEach(l => { listMap[l.id] = l.name })

    return cards.map((card) => {
      const isOverdue = card.due
        ? new Date(card.due) < new Date() && !card.dueComplete
        : false

      // Checklist stats
      let checklistText = ''
      let hasIncompleteChecklist = false
      if (card.badges && card.badges.checkItems > 0) {
        checklistText = `${card.badges.checkItemsChecked}/${card.badges.checkItems} completed`
        hasIncompleteChecklist = card.badges.checkItemsChecked < card.badges.checkItems
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
          hasIncompleteChecklist = completedItems < totalItems
        }
      }

      // Priority from label names
      let priority = 'Normal'
      const highLabel = card.labels?.find(
        l => l.name?.toLowerCase().includes('high') || l.name?.toLowerCase().includes('urgent')
      )
      if (highLabel) priority = highLabel.name

      // Member extraction
      const assignedMembers = card.members?.map(m => m.username || m.fullName || m.id) || []
      const primaryMember = card.members?.[0]
      let avatar = null
      if (primaryMember) {
        if (primaryMember.avatarUrl && primaryMember.avatarUrl.startsWith('http')) {
          avatar = primaryMember.avatarUrl
        } else if (primaryMember.avatarHash) {
          avatar = `https://trello-avatars.s3.amazonaws.com/${primaryMember.avatarHash}/50.png`
        } else if (primaryMember.avatar) {
          avatar = `https://trello-avatars.s3.amazonaws.com/${primaryMember.avatar}/50.png`
        }
      }

      // Resolve list name: prefer card.list?.name, then listMap lookup, then idList
      const listName =
        card.list?.name ||
        (card.idList ? listMap[card.idList] : null) ||
        'Board List'

      // Resolve board name
      const boardName = card.board?.name || 'Current Board'

      return {
        id: card.id,
        title: card.name || 'Untitled Card',
        description: card.desc || '',
        board: boardName,
        list: listName,
        priority,
        dueDate: card.due
          ? new Date(card.due).toISOString().split('T')[0]
          : 'No Due Date',
        isOverdue,
        hasIncompleteChecklist,
        checklistText,
        assignedMembers,
        labels: card.labels?.map(l => l.name).filter(Boolean) || [],
        status: card.closed ? 'Archived' : 'Active',
        avatar,
        url: card.url || card.shortUrl || null,
        shortLink: card.shortLink || null
      }
    })
  } catch {
    return []
  }
}
