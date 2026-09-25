# Pinpoint — Trello Power-Up

Instantly search, filter, and jump to any card across your Trello board — by keyword, member, priority, due date, and more.

## Live URL

**Connector:** `https://smart-search-murex.vercel.app/connector.html`

## Features

- Real-time keyword search across card titles, descriptions, labels, lists and boards
- Deep filters: list, member, priority, due date, checklist status
- Quick filter pills: Me, High Priority, Overdue, Incomplete Checklist
- Saved Pinpoints — name and reapply filter presets in one click
- Opens cards directly in Trello (no new tab)

## Tech Stack

- React 19, Tailwind CSS 4, Vite 8
- Trello Power-Up Client SDK (zero-auth, no API key needed)
- Deployed on Vercel

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
git push   # Vercel auto-deploys from main branch
```

## Project Structure

```
public/
  connector.html      # Trello connector (calls TrelloPowerUp.initialize)
  icons/              # Self-hosted SVG icons for board button
src/
  App.jsx             # Root component — state, search logic, card navigation
  main.jsx            # React entry point
  index.css           # Global styles + Tailwind
  trelloPowerUp.js    # TrelloPowerUp.iframe() context helper
  components/
    SearchBar.jsx     # Keyword input + quick search chips
    DeepFilters.jsx   # Advanced filter panel
    SavedSearches.jsx # Saved search presets
    CardList.jsx      # Filtered card results list
  services/
    trelloBoardSdk.js # Fetches real board cards via Trello SDK
    trelloApi.js      # Client-side filter + sort logic
  data/
    mockCards.js      # Fallback data used outside Trello
```
