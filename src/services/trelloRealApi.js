const TRELLO_BASE_URL = 'https://api.trello.com/1'

export async function fetchLiveCards(apiKey, token) {
  if (!apiKey || !token) {
    throw new Error('API Key and User Token are required to fetch live Trello workspace data.')
  }

  // Fetch open cards across all user boards with full details
  const cardsRes = await fetch(
    `${TRELLO_BASE_URL}/members/me/cards?filter=open&checklists=all&members=true&member_fields=fullName,username,avatarUrl&board=true&board_fields=name&list=true&list_fields=name&key=${apiKey}&token=${token}`
  )

  if (!cardsRes.ok) {
    throw new Error(`Failed to fetch cards from Trello API (${cardsRes.status} ${cardsRes.statusText})`)
  }

  const rawCards = await cardsRes.json()

  // Transform raw Trello API objects into normalized card models
  return rawCards.map((card) => {
    const isOverdue = card.due ? new Date(card.due) < new Date() && !card.dueComplete : false

    // Checklist stats
    let checklistText = ''
    let hasIncompleteChecklist = false
    if (card.checklists && card.checklists.length > 0) {
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

    // Priority extraction from labels or custom fields
    let priority = 'Normal'
    const highLabel = card.labels?.find(l => l.name?.toLowerCase().includes('high') || l.name?.toLowerCase().includes('urgent'))
    if (highLabel) {
      priority = highLabel.name
    }

    // Assigned members
    const assignedMembers = card.members?.map(m => m.username) || []

    // Primary avatar
    const primaryMember = card.members?.[0]
    const avatar = primaryMember?.avatarUrl ? `${primaryMember.avatarUrl}/50.png` : null

    return {
      id: card.id,
      title: card.name,
      description: card.desc || '',
      board: card.board?.name || 'Workspace Board',
      list: card.list?.name || 'List',
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
}
