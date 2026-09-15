const TOKEN_STORAGE_KEY = 'trello_powerup_token'

export async function getStoredToken(t) {
  if (t) {
    try {
      // First check if Trello REST API helper already has a token
      if (typeof t.getRestApi === 'function') {
        const restApi = t.getRestApi()
        if (restApi && typeof restApi.getToken === 'function') {
          const tToken = await restApi.getToken()
          if (tToken) return tToken
        }
      }
      const token = await t.get('member', 'private', 'token')
      if (token) return token
    } catch {
      // Fallback
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
  if (t && typeof t.getRestApi === 'function') {
    try {
      const restApi = t.getRestApi()
      if (restApi && typeof restApi.clearToken === 'function') {
        await restApi.clearToken()
      }
    } catch {
      // Ignore
    }
  }
  if (t) {
    try {
      await t.remove('member', 'private', 'token')
    } catch {
      // Ignore
    }
  }
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export function authorizeWithTrello(t, apiKey) {
  return new Promise((resolve, reject) => {
    // Priority 1: Native Trello Power-Up RestApi Authorization (inside iframe)
    if (t && typeof t.getRestApi === 'function') {
      try {
        const restApi = t.getRestApi()
        if (restApi && typeof restApi.authorize === 'function') {
          restApi.authorize({
            scope: 'read,write',
            expiration: 'never'
          }).then(async (token) => {
            if (token) {
              await saveToken(t, token)
              resolve(token)
            } else {
              reject(new Error('No token returned from Trello Authorization.'))
            }
          }).catch((err) => {
            reject(new Error(err?.message || 'Trello authorization was declined or closed.'))
          })
          return
        }
      } catch {
        // Continue to fallback
      }
    }

    // Priority 2: Standalone API Key popup authorization
    const key = apiKey || import.meta.env.VITE_TRELLO_API_KEY
    if (!key) {
      reject(new Error('Missing Trello API Key.'))
      return
    }

    const appName = import.meta.env.VITE_APP_NAME || 'Smart Search Power-Up'
    const returnUrl = window.location.href
    const authUrl = `https://trello.com/1/authorize?expiration=never&name=${encodeURIComponent(appName)}&scope=read,write&response_type=token&key=${key}&return_url=${encodeURIComponent(returnUrl)}`

    const authWindow = window.open(authUrl, 'TrelloAuthorization', 'width=580,height=700')

    const timer = setInterval(() => {
      if (authWindow && authWindow.closed) {
        clearInterval(timer)
        const hashMatch = window.location.hash.match(/token=([^&]+)/)
        if (hashMatch && hashMatch[1]) {
          const token = hashMatch[1]
          saveToken(t, token)
          resolve(token)
        } else {
          const token = localStorage.getItem(TOKEN_STORAGE_KEY)
          if (token) resolve(token)
          else reject(new Error('Authorization popup closed.'))
        }
      }
    }, 500)
  })
}
