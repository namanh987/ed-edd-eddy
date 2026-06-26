# Ed, Edd n Eddy — Frontend

Next.js 14 frontend for the AI English Companions app.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000 (default, no change needed for local dev)

# 3. Run dev server
npm run dev
```

App runs at `http://localhost:3000`

> Make sure the backend is running on port 8000 before opening the app.

## Structure

```
frontend/
├── app/
│   ├── layout.jsx           # Root layout + global metadata
│   ├── page.jsx             # Home route → persona selector
│   └── chat/[id]/
│       └── page.jsx         # Chat route → streaming chat UI
├── components/
│   ├── HomePage.jsx         # Cul-de-sac landing page + character cards
│   └── ChatPage.jsx         # Chat interface with SSE streaming
├── lib/
│   ├── api.js               # All backend API calls + SSE stream handler
│   └── personas.js          # Ed, Edd, Eddy config (colors, descriptions)
└── styles/
    ├── globals.css          # Global reset + CSS variables
    ├── Home.module.css      # Landing page styles (cartoon atmosphere)
    └── Chat.module.css      # Chat page styles
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Persona selector — pick Ed, Edd, or Eddy to start |
| `/chat/[id]` | Chat with the selected persona, streams responses live |

## Design

Styled after the original Cartoon Network show:
- Wobbly border animations mimicking the show's "boiling lines"
- Official show color palette (Ed's orange, Edd's blue, Eddy's red)
- Cul-de-sac background with houses, road, and floating jawbreakers
- Comic Sans typography with thick outlines
- Hand-drawn SVG character illustrations (original character designs are copyrighted)

---

*Ed, Edd n Eddy™ & © Cartoon Network. Fan-made educational app. Not affiliated with or endorsed by Cartoon Network.*