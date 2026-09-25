// Trello Power-Up Context Helper for Secondary Modal Iframe (Zero Auth Mode)

export function getTrelloContext() {
  if (typeof window !== 'undefined' && window.TrelloPowerUp) {
    try {
      return window.TrelloPowerUp.iframe()
    } catch {
      return null
    }
  }
  return null
}
