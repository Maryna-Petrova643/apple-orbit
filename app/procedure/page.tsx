import type { Metadata } from "next";
import s from "./procedure.module.css";

export const metadata: Metadata = {
  title: "Apple Orbit AI Agent — Build & Deployment Procedure",
  description: "How the Apple Orbit iPhone agent prototype was built from a requirements document and deployed on Vercel.",
};

const REPO = "https://github.com/Maryna-Petrova643/apple-orbit";

const screens = [
  ["Home", "Apple Orbit greets the user: “How can I make your day better and more productive today?” Ask Orbit, favourite agents, and an Up next widget.", "Requirement: main agent greeting"],
  ["Library", "All 19 agents in four groups, with search, filters, and an App Store–style detail page for each agent.", "Requirement: agent library"],
  ["Capture", "Speak or type a request. Orbit picks the right agent, shows a step-by-step plan, and waits for approval.", "Requirement: voice / text capture"],
  ["Build", "Create a custom agent: name, icon, job, audience, permissions, tone, and an “Ask before acting” switch.", "Requirement: build your own agent"],
];

const stack = [
  ["Framework", "Next.js + React", "Industry standard; first-class Vercel support; easy to add server-side AI calls later."],
  ["Language", "TypeScript", "Catches mistakes early and makes the agent data structure explicit."],
  ["Styling", "CSS design tokens", "Full control to match iOS: system font, Liquid Glass blur, grouped lists, dark mode."],
  ["Voice", "Web Speech API", "Real speech-to-text in Chrome and Safari, no API key needed."],
  ["Code hosting", "GitHub", "Version history and the trigger for automatic deployments."],
  ["Hosting", "Vercel (Hobby)", "Zero-config deploys, public .vercel.app URL, instant rollbacks."],
];

const files = [
  ["lib/agents.ts", "Agent catalogue from the requirements doc and the routing function."],
  ["components/AgentsApp.tsx", "The four screens, tab bar, sheets, voice capture, and agent builder."],
  ["app/globals.css", "Design system: colours, type, glass materials, phone frame, dark mode."],
  ["app/layout.tsx", "Page title, fonts, and mobile viewport settings."],
  ["app/procedure/page.tsx", "This procedure page."],
];

type Phase = { title: string; steps: (string | { code: string[] })[] };
const phases: Phase[] = [
  { title: "Requirements to specification", steps: [
    "Read the requirements document: four screens, 19 agents in four user groups, and a style reference screenshot.",
    "Turned each agent into structured data: name, description, who it helps, example request, plan steps.",
    "Chose a native iOS design language so reviewers judge the concept, not an unfamiliar UI.",
  ] },
  { title: "Build the prototype", steps: [
    "Created a Next.js project with TypeScript.",
    "Wrote the agent catalogue in lib/agents.ts so content lives separately from the UI.",
    "Built the four screens as React components, plus bottom sheets for details and capture.",
    "Added the iOS design system and automatic dark mode in globals.css.",
    "Tested every screen and fixed issues found in testing, such as requests routed to the wrong agent.",
  ] },
  { title: "Run it locally (Windows, VS Code)", steps: [
    "Opened the apple-agents folder in VS Code (File → Open Folder) and the terminal with Ctrl + `.",
    "Installed dependencies and started the dev server:",
    { code: ["npm.cmd install", "npm.cmd run dev"] },
    "Checked http://localhost:3000 in Chrome, then stopped the server with Ctrl + C.",
  ] },
  { title: "Save the code to GitHub", steps: [
    "Set my Git identity once per computer, using GitHub's private no-reply email:",
    { code: ['git config --global user.name "Maryna Petrova"', 'git config --global user.email "<id>+Maryna-Petrova643@users.noreply.github.com"'] },
    "Created an empty repository named apple-orbit on GitHub (no README), then committed and pushed:",
    { code: ["git init -b main", "git add .", 'git commit -m "Apple Orbit AI Agent prototype"', "git remote add origin https://github.com/Maryna-Petrova643/apple-orbit.git", "git push -u origin main"] },
  ] },
  { title: "Deploy on Vercel", steps: [
    "Signed in to vercel.com with GitHub on the free Hobby plan.",
    "Clicked Import Project and gave the Vercel GitHub app access to the apple-orbit repository.",
    "Confirmed Framework Preset = Next.js, kept the defaults, and clicked Deploy.",
    "About a minute later the app was live at apple-orbit.vercel.app.",
  ] },
  { title: "Iterate", steps: [
    "Edit in VS Code, check locally with npm.cmd run dev, then publish:",
    { code: ["git pull", "git add .", 'git commit -m "Describe the change"', "git push"] },
    "Vercel rebuilds automatically. If something breaks, promote the previous deployment in Vercel → Deployments to roll back instantly.",
  ] },
];

const problems = [
  ["“npm.ps1 cannot be loaded… running scripts is disabled”", "Windows PowerShell execution policy blocks script files.", "Used npm.cmd instead of npm."],
  ["“unable to auto-detect email address”", "Git didn't know who was committing.", "Set user.name and user.email with git config --global."],
  ["“src refspec main does not match any”", "Push ran before any commit existed.", "Committed first, then pushed."],
  ["App looked squashed in VS Code", "The built-in preview pane was too short.", "Opened localhost:3000 in Chrome."],
  ["Requests routed to the wrong agent", "Keyword lists were too narrow.", "Added keywords and re-tested 7 sample requests until all routed correctly."],
];

const decisions = [
  ["Keyword routing, not an LLM", "Free, instant, predictable; enough to test the UX.", "Next: LLM routing via an API route, measured with an eval set."],
  ["Plans are sample steps", "Safe; nothing is booked or sent.", "Real version connects to iPhone services with explicit permissions."],
  ["Custom agents stored in the browser", "No login or database needed yet.", "Next: accounts and cloud storage."],
  ["“Ask before acting” on by default", "Trust and safety for agents that take actions.", "Could relax for low-risk actions."],
  ["Accessibility agents as a full group", "Required by the doc and a strong differentiator.", "Needs testing with real VoiceOver and captions users."],
];

const metrics = [
  ["Task completion", "Requests where the plan is approved and the task gets done."],
  ["Routing accuracy", "Requests sent to the right agent, measured on a labelled test set."],
  ["Time saved", "Seconds from intent to done, compared with using an app."],
  ["Repeat usage", "Users returning to an agent within 7 and 30 days."],
  ["Trust guardrails", "Edit rate, rejected plans, and wrong-action reports."],
];

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead><tr>{head.map(h => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{rows.map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export default function ProcedurePage() {
  return (
    <main className={s.page}>
      <div className={s.wrap}>
        <p className={s.eyebrow}>Build &amp; deployment procedure</p>
        <h1 className={s.title}>Apple Orbit AI Agent</h1>
        <p className={s.lede}>How I turned a requirements document into a live iPhone agent-platform prototype, versioned on GitHub and deployed on Vercel.</p>
        <div className={s.links}>
          <a className={`${s.btn} ${s.primary}`} href="/">Open the prototype</a>
          <a className={`${s.btn} ${s.ghost}`} href={REPO} target="_blank" rel="noreferrer">View the code on GitHub</a>
        </div>

        <ul className={s.toc}>
          {[["summary", "Summary"], ["screens", "Screens"], ["stack", "Stack"], ["structure", "Structure"], ["procedure", "Procedure"], ["problems", "Problems solved"], ["decisions", "Decisions"], ["metrics", "Metrics"]].map(([id, label]) => (
            <li key={id}><a href={`#${id}`}>{label}</a></li>
          ))}
        </ul>

        <section id="summary" className={s.section}>
          <h2 className={s.h2}>The 30-second summary</h2>
          <div className={s.demo}>
            <div>
              <p className={s.p}><b>The idea.</b> Instead of downloading an app for every task, iPhone users tell one assistant what they need, and it hands the request to a specialised AI agent: travel, tasks, homework, accessibility, and more.</p>
              <p className={s.p}><b>What I built.</b> A clickable, mobile-first prototype with four screens, built from a requirements document, styled in Apple&apos;s iOS design language, and deployed publicly with automatic redeploys on every change.</p>
              <p className={s.p}><b>Why it matters.</b> It shows the full product loop: requirements → spec → working prototype → deployment → iteration.</p>
              <div className={s.quote}><b>How to say it: </b>“I took a requirements doc with 19 agents across four user groups, turned it into a working iPhone prototype, and shipped it to a public URL. Every change I push to GitHub goes live in about a minute.”</div>
            </div>
            <div className={s.frameWrap}><iframe className={s.frame} src="/" title="Live Apple Orbit prototype" loading="lazy" /></div>
          </div>
        </section>

        <section id="screens" className={s.section}>
          <h2 className={s.h2}>What the prototype does</h2>
          <div className={s.grid2}>
            {screens.map(([t, d, r]) => <div key={t} className={s.tile}><h4>{t}</h4><p>{d}</p><span className={s.tag}>{r}</span></div>)}
          </div>
          <p className={s.p} style={{ marginTop: 16 }}><b>Agent groups:</b> Everyone (4), Students (5), People with disabilities (7), Busy professionals (3).</p>
        </section>

        <section id="stack" className={s.section}>
          <h2 className={s.h2}>Tech stack and why</h2>
          <Table head={["Layer", "Tool", "Why"]} rows={stack} />
        </section>

        <section id="structure" className={s.section}>
          <h2 className={s.h2}>How the code is organised</h2>
          <Table head={["File", "Responsibility"]} rows={files} />
          <h3 className={s.h3}>Request flow</h3>
          <div className={s.flow}>
            <span>Voice or text</span><i>→</i><span>Speech to text</span><i>→</i><span>routeRequest() picks agent</span><i>→</i><span>Plan shown</span><i>→</i><span>User approves</span>
          </div>
          <div className={s.quote}><b>Design principle: </b>“Ask before acting” is on by default. For AI that can send messages or spend money, a confirmation step builds trust and limits the cost of mistakes.</div>
        </section>

        <section id="procedure" className={s.section}>
          <h2 className={s.h2}>Step-by-step procedure</h2>
          {phases.map((ph, i) => (
            <div key={ph.title} className={s.phase}>
              <div className={s.phaseHead}><span className={s.num}>{i + 1}</span><h3>{ph.title}</h3></div>
              {(() => {
                const out: React.ReactNode[] = []; let buf: string[] = []; let n = 1;
                const flush = (k: string) => { if (buf.length) { out.push(<ol key={k} className={s.steps} start={n}>{buf.map(t => <li key={t}>{t}</li>)}</ol>); n += buf.length; buf = []; } };
                ph.steps.forEach((st, j) => {
                  if (typeof st === "string") buf.push(st);
                  else { flush(`o${j}`); out.push(<pre key={`c${j}`} className={s.pre}>{st.code.join("\n")}</pre>); }
                });
                flush("end");
                return out;
              })()}
            </div>
          ))}
        </section>

        <section id="problems" className={s.section}>
          <h2 className={s.h2}>Problems I hit and how I solved them</h2>
          <Table head={["Problem", "Cause", "Fix"]} rows={problems} />
          <div className={s.quote}><b>Interview angle: </b>Debugging environment issues is part of shipping. I read the error, found the cause, fixed it, and documented it so the next person doesn&apos;t lose time.</div>
        </section>

        <section id="decisions" className={s.section}>
          <h2 className={s.h2}>Product decisions and trade-offs</h2>
          <Table head={["Decision", "Why", "Trade-off / next step"]} rows={decisions} />
        </section>

        <section id="metrics" className={s.section}>
          <h2 className={s.h2}>How I would measure success</h2>
          <div className={s.grid2}>{metrics.map(([t, d]) => <div key={t} className={s.tile}><h4>{t}</h4><p>{d}</p></div>)}</div>
        </section>

        <p className={s.footer}>Maryna Petrova · September 2026 · Concept prototype, not affiliated with Apple Inc.</p>
      </div>
    </main>
  );
}
