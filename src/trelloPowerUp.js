// Initialize Trello Power-Up capabilities if running inside Trello iframe
export function initTrelloPowerUp() {
  if (typeof window !== 'undefined' && window.TrelloPowerUp) {
    try {
      window.TrelloPowerUp.initialize({
        'board-buttons': function () {
          return [
            {
              icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/search.svg',
              text: 'Smart Search',
              callback: function (tContext) {
                return tContext.modal({
                  title: 'Search Workspace Cards',
                  url: './index.html',
                  height: 660,
                  fullscreen: false
                })
              }
            }
          ]
        },
        'show-authorization': function (tContext) {
          return tContext.popup({
            title: 'Authorization Required',
            url: './index.html',
            height: 380
          })
        }
      })
    } catch {
      // Already initialized or running in sub-iframe mode
    }
  }
}

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
