import { useState } from 'react'

export default function AuthScreen({ onAuthorize, error }) {
  const [apiKeyInput, setApiKeyInput] = useState(import.meta.env.VITE_TRELLO_API_KEY || '')
  const [isAuthorizing, setIsAuthorizing] = useState(false)

  const handleAuthorizeClick = async () => {
    setIsAuthorizing(true)
    try {
      await onAuthorize(apiKeyInput)
    } catch {
      // Error handled by parent
    } finally {
      setIsAuthorizing(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center space-y-6 bg-[#090e17] text-slate-100 font-sans">
      <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-3xl shadow-xl shadow-blue-500/10">
        ⚡
      </div>

      <div className="max-w-md space-y-2">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Authorize Smart Search Power-Up
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Connect your Trello account to enable deep searching, live workspace card indexing, and smart filter presets across your boards.
        </p>
      </div>

      {/* API Key Input if not set in .env */}
      {!import.meta.env.VITE_TRELLO_API_KEY && (
        <div className="w-full max-w-md text-left space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Trello API Key
          </label>
          <input
            type="text"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="Paste your Trello API Key from trello.com/power-ups/admin"
            className="w-full bg-[#121c2e] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <p className="text-[11px] text-slate-500">
            Get your key at{' '}
            <a
              href="https://trello.com/power-ups/admin"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline"
            >
              trello.com/power-ups/admin
            </a>
          </p>
        </div>
      )}

      {error && (
        <div className="max-w-md w-full p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs text-left">
          <strong>Authorization Warning:</strong> {error}
        </div>
      )}

      <button
        onClick={handleAuthorizeClick}
        disabled={isAuthorizing || (!apiKeyInput && !import.meta.env.VITE_TRELLO_API_KEY)}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/25"
      >
        {isAuthorizing ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
            <span>Connecting to Trello...</span>
          </>
        ) : (
          <>
            <span>🔒 Authorize Trello Account</span>
          </>
        )}
      </button>

      <div className="pt-4 border-t border-slate-800/80 max-w-xs text-[11px] text-slate-500">
        Your authorization token is stored securely within your Trello session.
      </div>
    </div>
  )
}
