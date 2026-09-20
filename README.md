# Apple Orbit AI Agent — iPhone prototype

A clickable prototype of an agent platform for iPhone, built from the "AI Agent" requirements doc and styled in the iOS design language (San Francisco font, Liquid Glass tab bar and sheets, app-icon squircles, grouped lists).

| Screen | What it does |
|---|---|
| 1. Home | Apple Orbit greets the user: "How can I make your day better and more productive today?" Tap-and-talk entry and suggested agents |
| 2. Library | All 19 agents in four groups (Everyone, Students, Accessibility, Professionals) with search, filters, and a detail sheet per agent |
| 3. Voice / Text capture | Voice or Type input. Apple Orbit routes the request to the best agent and shows a plan to approve |
| 4. Build your own agent | Name, icon, what it should do, audience, permissions, tone, and "ask before acting". New agents appear in the Library |

## Run it locally (Windows, VS Code terminal)

```powershell
npm install
npm run dev
```
Open http://localhost:3000. Voice input works in Chrome and Safari (it asks for microphone permission). In browsers without speech recognition, the mic runs a demo transcript.

## Project map

```
app/layout.tsx          # system font (San Francisco on Apple devices, Inter elsewhere) and metadata
app/page.tsx            # renders the app
app/globals.css         # all styling: colors, type, phone frame, sheets
components/AgentsApp.tsx# the four screens, bottom sheet, voice capture, agent builder
lib/agents.ts           # agent catalog from the requirements doc + request routing
```

**Change agent content:** edit `lib/agents.ts`. **Change colors:** edit the variables at the top of `app/globals.css`.

## Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. Go to vercel.com → Add New → Project → Import the repo.
3. Keep the defaults (Framework: Next.js) and click Deploy.
4. Every push to `main` redeploys automatically.

## What's simulated

- Agent plans are sample steps from `lib/agents.ts`; nothing is booked or sent.
- Request routing is keyword matching. A production version would use an LLM to pick the agent and write the plan.
- Built agents are saved in the browser (localStorage), not a database.
