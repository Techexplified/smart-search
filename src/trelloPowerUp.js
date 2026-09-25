// Trello Power-Up Context Helper for Secondary Modal Iframe (Zero Auth Mode)
// The modal iframe receives the Trello context via the message channel established
// by the connector; we do NOT call TrelloPowerUp.initialize() here.

export function getTrelloContext() {
  if (typeof window === 'undefined') return null

  // In connector context (when running in Trello iframe mode)
  if (window.TrelloPowerUp && typeof window.TrelloPowerUp.iframe === 'function') {
    try {
      return window.TrelloPowerUp.iframe()
    } catch {
      return null
    }
  }

  return null
}
