const TOKEN_STORAGE_KEY = 'trello_powerup_token'

export async function getStoredToken(t) {
  if (t) {
    try {
      const token = await t.get('member', 'private', 'token')
      if (token) return token
    } catch {
      // Fallback to localStorage if not inside Trello context
    }
  }
  return localStorage.getItem(TOKEN_STORAGE_KEY) || null
}

export async function saveToken(t, token) {
  if (t) {
    try {
      await t.set('member', 'private', 'token', token)
    } catch {
      // Ignore fallback
    }
  }
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export async function clearToken(t) {
  if (t) {
    try {
      await t.remove('member', 'private', 'token')
    } catch {
      // Ignore fallback
    }
  }
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export function authorizeWithTrello(t, apiKey) {
  return new Promise((resolve, reject) => {
    const key = apiKey || import.meta.env.VITE_TRELLO_API_KEY
    if (!key) {
      reject(new Error('Missing Trello API Key. Please provide VITE_TRELLO_API_KEY.'))
      return
    }

    const appName = import.meta.env.VITE_APP_NAME || 'Smart Search Power-Up'

    // If running in Trello Power-Up context, use t.getRestApi().authorize()
    if (t && typeof t.getRestApi === 'function') {
      const restApi = t.getRestApi()
      if (restApi && typeof restApi.authorize === 'function') {
        restApi.authorize({
          scope: 'read,write',
          expiration: 'never'
        }).then(async (token) => {
          await saveToken(t, token)
          resolve(token)
        }).catch(reject)
        return
      }
    }

    // Fallback Popup authorization via Trello's OAuth endpoint
    const returnUrl = window.location.href
    const authUrl = `https://trello.com/1/authorize?expiration=never&name=${encodeURIComponent(appName)}&scope=read&response_type=token&key=${key}&return_url=${encodeURIComponent(returnUrl)}`

    const authWindow = window.open(authUrl, 'TrelloAuthorization', 'width=580,height=700')

    const timer = setInterval(() => {
      if (authWindow && authWindow.closed) {
        clearInterval(timer)
        // Check hash or storage
        const hashMatch = window.location.hash.match(/token=([^&]+)/)
        if (hashMatch && hashMatch[1]) {
          const token = hashMatch[1]
          saveToken(t, token)
          resolve(token)
        } else {
          const token = localStorage.getItem(TOKEN_STORAGE_KEY)
          if (token) resolve(token)
          else reject(new Error('Authorization was closed or cancelled.'))
        }
      }
    }, 500)
  })
}
