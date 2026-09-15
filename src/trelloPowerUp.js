// Initialize Trello Power-Up capabilities if running inside Trello iframe
export function initTrelloPowerUp() {
  if (typeof window !== 'undefined' && window.TrelloPowerUp) {
    try {
      window.TrelloPowerUp.initialize({
        'board-buttons': function (tContext) {
          return [
            {
              icon: {
                dark: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/search.svg',
                light: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/search.svg'
              },
              text: 'Smart Search',
              callback: function (t) {
                return t.modal({
                  title: 'Search Workspace Cards',
                  url: './index.html',
                  height: 680,
                  fullscreen: false
                })
              }
            }
          ]
        },
        'card-buttons': function (tContext) {
          return [
            {
              icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/search.svg',
              text: 'Smart Search',
              callback: function (t) {
                return t.modal({
                  title: 'Search Workspace Cards',
                  url: './index.html',
                  height: 680,
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
