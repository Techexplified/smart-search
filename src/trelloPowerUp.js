// Initialize Trello Power-Up capabilities (Zero Auth Mode)
export function initTrelloPowerUp() {
  if (typeof window !== 'undefined' && window.TrelloPowerUp) {
    try {
      window.TrelloPowerUp.initialize({
        'board-buttons': function () {
          return [
            {
              icon: {
                dark: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/search.svg',
                light: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/search.svg'
              },
              text: 'Smart Search',
              callback: function (t) {
                return t.modal({
                  title: 'Search Board Cards',
                  url: './index.html',
                  height: 680,
                  fullscreen: false
                })
              }
            }
          ]
        },
        'card-buttons': function () {
          return [
            {
              icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/search.svg',
              text: 'Smart Search',
              callback: function (t) {
                return t.modal({
                  title: 'Search Board Cards',
                  url: './index.html',
                  height: 680,
                  fullscreen: false
                })
              }
            }
          ]
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
