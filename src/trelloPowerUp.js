// Initialize Trello Power-Up capabilities if running inside Trello iframe
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
                  title: 'Search Workspace Cards',
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
                  title: 'Search Workspace Cards',
                  url: './index.html',
                  height: 680,
                  fullscreen: false
                })
              }
            }
          ]
        },
        'show-authorization': function (t) {
          return t.popup({
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

export function getTrelloContext(apiKey) {
  if (typeof window !== 'undefined' && window.TrelloPowerUp) {
    try {
      const key = apiKey || import.meta.env.VITE_TRELLO_API_KEY
      const appName = import.meta.env.VITE_APP_NAME || 'Smart Search Power-Up'
      return window.TrelloPowerUp.iframe({
        appKey: key,
        appName: appName
      })
    } catch {
      return null
    }
  }
  return null
}
