"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Accessibility, BookOpen, Brain, Briefcase, CalendarCheck, ChefHat, ClipboardList, Dumbbell, Ear, Eye,
  GraduationCap, Hand, House, Keyboard, Languages, LayoutGrid, ListTodo, MessageSquare, Mic, Plane, Plus,
  Search, SlidersHorizontal, Sparkles, Square, Wand2, X, Check, ChevronRight, Bot, Heart, MapPin, Camera,
  Calendar, Bell, Leaf, Music,
} from "lucide-react";
import { AGENTS, CATEGORIES, routeRequest, type Agent, type CategoryId } from "@/lib/agents";

type IconType = React.ComponentType<{ size?: number; strokeWidth?: number; fill?: string }>;

/* Each icon gets an iOS-style gradient squircle, like apps on the Home Screen. */
const ICONS: Record<string, { I: IconType; bg: [string, string] }> = {
  plane:        { I: Plane,             bg: ["#5AC8FA", "#007AFF"] },
  mic:          { I: Mic,               bg: ["#FFCC00", "#FF9500"] },
  chef:         { I: ChefHat,           bg: ["#4CD964", "#28A745"] },
  dumbbell:     { I: Dumbbell,          bg: ["#FF6482", "#FF2D55"] },
  graduation:   { I: GraduationCap,     bg: ["#7D7AFF", "#5856D6"] },
  calendarCheck:{ I: CalendarCheck,     bg: ["#FF6961", "#FF3B30"] },
  book:         { I: BookOpen,          bg: ["#FFB340", "#FF8A00"] },
  sparkles:     { I: Sparkles,          bg: ["#DA8FFF", "#AF52DE"] },
  languages:    { I: Languages,         bg: ["#64D2FF", "#32ADE6"] },
  eye:          { I: Eye,               bg: ["#409CFF", "#0A5DDB"] },
  ear:          { I: Ear,               bg: ["#FF9F7A", "#FF6A3D"] },
  message:      { I: MessageSquare,     bg: ["#65E38B", "#30B35A"] },
  hand:         { I: Hand,              bg: ["#B2A4FF", "#7B61FF"] },
  brain:        { I: Brain,             bg: ["#FF8AC4", "#E8458B"] },
  accessibility:{ I: Accessibility,     bg: ["#4FB3FF", "#0071E3"] },
  sliders:      { I: SlidersHorizontal, bg: ["#A2A2A8", "#636366"] },
  briefcase:    { I: Briefcase,         bg: ["#8E8E93", "#3A3A3C"] },
  listTodo:     { I: ListTodo,          bg: ["#FF9F0A", "#FF6B00"] },
  clipboard:    { I: ClipboardList,     bg: ["#5EE7DF", "#1FB5AC"] },
  bot:          { I: Bot,               bg: ["#6A8BFF", "#4B4BFF"] },
  heart:        { I: Heart,             bg: ["#FF6482", "#FF2D55"] },
  leaf:         { I: Leaf,              bg: ["#7EE081", "#34C759"] },
  music:        { I: Music,             bg: ["#FF7A9A", "#FA2D48"] },
  camera:       { I: Camera,            bg: ["#9BA3AF", "#4B5563"] },
};

function AppIcon({ name, size = 44 }: { name: string; size?: number }) {
  const { I, bg } = ICONS[name] ?? ICONS.bot;
  return (
    <span className="appicon" style={{ width: size, height: size, borderRadius: size * 0.2375, background: `linear-gradient(180deg, ${bg[0]}, ${bg[1]})` }}>
      <I size={Math.round(size * 0.55)} strokeWidth={2} />
    </span>
  );
}

function Orb({ size = 64, live = false }: { size?: number; live?: boolean }) {
  return <span className={`orb ${live ? "is-live" : ""}`} style={{ width: size, height: size }} aria-hidden="true"><span /></span>;
}

type Tab = "home" | "library" | "build" | "mine";
type Result = { agent: Agent; request: string };
const STORE_KEY = "muse-my-agents"; // kept so agents saved before the rename still load
const shortName = (a: Agent) => a.name.replace(/ Agent$/, "");

export default function AgentsApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureAgent, setCaptureAgent] = useState<Agent | null>(null);
  const [detail, setDetail] = useState<Agent | null>(null);
  const [myAgents, setMyAgents] = useState<Agent[]>([]);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORE_KEY); if (raw) setMyAgents(JSON.parse(raw)); } catch {}
  }, []);
  const saveMine = (list: Agent[]) => {
    setMyAgents(list);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch {}
  };
  const allAgents = useMemo(() => [...myAgents, ...AGENTS], [myAgents]);
  const [demoRequest, setDemoRequest] = useState<string | null>(null);
  const [buildDemo, setBuildDemo] = useState(false);
  const openCapture = (agent: Agent | null = null) => { setDemoRequest(null); setCaptureAgent(agent); setDetail(null); setCaptureOpen(true); };

  // Deep links for the procedure page previews: /?screen=library | capture | build
  useEffect(() => {
    const screen = new URLSearchParams(window.location.search).get("screen");
    if (screen === "library") setTab("library");
    if (screen === "build") { setTab("build"); setBuildDemo(true); }
    if (screen === "capture") { setDemoRequest("Plan a weekend in Chicago"); setCaptureOpen(true); }
  }, []);

  return (
    <div className="stage">
      <div className="phone">
        <div className="statusbar" aria-hidden="true"><span>9:41</span><span className="island" /><span className="sb-right">5G ▮</span></div>

        <main className="screen">
          {tab === "home" && <HomeScreen onCapture={() => openCapture()} onOpen={setDetail} onBrowse={() => setTab("library")} />}
          {tab === "library" && <LibraryScreen mine={myAgents} only={null} onOpen={setDetail} onBuild={() => setTab("build")} />}
          {tab === "mine" && <LibraryScreen mine={myAgents} only="mine" onOpen={setDetail} onBuild={() => setTab("build")} />}
          {tab === "build" && <BuildScreen demo={buildDemo} onCreate={(a) => { saveMine([a, ...myAgents]); setTab("mine"); setDetail(a); }} />}
        </main>

        <nav className="dock" aria-label="Main">
          <div className="glass tabbar">
            <TabButton label="Home" active={tab === "home"} onClick={() => setTab("home")}><House size={22} strokeWidth={2} /></TabButton>
            <TabButton label="Library" active={tab === "library"} onClick={() => setTab("library")}><LayoutGrid size={22} strokeWidth={2} /></TabButton>
            <TabButton label="Build" active={tab === "build"} onClick={() => setTab("build")}><Wand2 size={22} strokeWidth={2} /></TabButton>
            <TabButton label="Mine" active={tab === "mine"} onClick={() => setTab("mine")}><Bot size={22} strokeWidth={2} /></TabButton>
          </div>
          <button className="glass fab" aria-label="Talk to Apple Orbit" onClick={() => openCapture()}><Mic size={24} strokeWidth={2.2} /></button>
        </nav>

        {detail && (
          <Sheet onClose={() => setDetail(null)} title={detail.name} hideTitle>
            <AgentDetail agent={detail} onTry={() => openCapture(detail)} />
          </Sheet>
        )}
        {captureOpen && (
          <Sheet onClose={() => setCaptureOpen(false)} title="Apple Orbit AI Agent" tall>
            <Capture agents={allAgents} fixedAgent={captureAgent} initialRequest={demoRequest} />
          </Sheet>
        )}
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={`tab ${active ? "is-active" : ""}`} onClick={onClick} aria-current={active ? "page" : undefined}>
      {children}<span>{label}</span>
    </button>
  );
}

/* ---------------------------------- Screen 1: Home ---------------------------------- */

function HomeScreen({ onCapture, onOpen, onBrowse }: { onCapture: () => void; onOpen: (a: Agent) => void; onBrowse: () => void }) {
  const now = new Date();
  const h = now.getHours();
  const hello = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const date = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const favorites = ["tasks", "travel", "meals", "fitness", "homework", "executive", "language", "vision"].map(id => AGENTS.find(a => a.id === id)!);

  return (
    <div className="page home">
      <div className="aurora" aria-hidden="true" />
      <p className="dateline">{date}</p>
      <h1 className="largetitle">{hello}</h1>

      <section className="hero glass-card">
        <Orb size={72} />
        <p className="hero-name">Apple Orbit AI Agent</p>
        <p className="hero-text">How can I make your day better and more productive today?</p>
        <button className="capsule primary" onClick={onCapture}><Mic size={18} strokeWidth={2.4} /> Ask Orbit</button>
      </section>

      <div className="section-head">
        <h2 className="title2">Your agents</h2>
        <button className="textbtn" onClick={onBrowse}>See All</button>
      </div>
      <div className="springboard">
        {favorites.map(a => (
          <button key={a.id} className="spring-item" onClick={() => onOpen(a)}>
            <AppIcon name={a.icon} size={60} />
            <span>{shortName(a).split(" ")[0]}</span>
          </button>
        ))}
      </div>

      <div className="section-head"><h2 className="title2">Up next</h2></div>
      <div className="widget">
        <div className="widget-head"><AppIcon name="mic" size={22} /><span>Task Tracker</span></div>
        {[["Soccer game", "Sat · 10:00 AM", "#FF9500"], ["Dentist", "Tue · 3:00 PM", "#FF3B30"], ["Book club", "Thu · 7:30 PM", "#AF52DE"]].map(([t, w, c]) => (
          <div key={t} className="event"><span className="event-bar" style={{ background: c }} /><div><strong>{t}</strong><span>{w}</span></div></div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- Screen 2: Library ---------------------------------- */

function LibraryScreen({ mine, only, onOpen, onBuild }: { mine: Agent[]; only: "mine" | null; onOpen: (a: Agent) => void; onBuild: () => void }) {
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const match = (a: Agent) => !query || `${a.name} ${a.does} ${a.who ?? ""}`.toLowerCase().includes(query);

  const groups = only === "mine"
    ? [{ id: "mine" as CategoryId, label: "Built by you", blurb: "" }]
    : [...(mine.length ? [{ id: "mine" as CategoryId, label: "Built by you", blurb: "" }] : []), ...CATEGORIES].filter(g => cat === "all" || g.id === cat);

  const empty = only === "mine" && mine.length === 0;

  return (
    <div className="page">
      <h1 className="largetitle">{only === "mine" ? "My Agents" : "Library"}</h1>

      {!only && (
        <>
          <label className="searchbar"><Search size={17} strokeWidth={2.2} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search" aria-label="Search agents" /></label>
          <div className="chips" role="group" aria-label="Filter by group">
            {[{ id: "all", label: "All" }, ...CATEGORIES].map(c => (
              <button key={c.id} className={`chip ${cat === c.id ? "is-on" : ""}`} onClick={() => setCat(c.id as CategoryId | "all")}>{c.label}</button>
            ))}
          </div>
        </>
      )}

      {empty && (
        <div className="empty">
          <Orb size={56} />
          <h2 className="title2">No agents yet</h2>
          <p className="secondary">Describe a job in plain words and Apple Orbit turns it into an agent.</p>
          <button className="capsule primary" onClick={onBuild}><Plus size={18} strokeWidth={2.4} /> Build an agent</button>
        </div>
      )}

      {groups.map(g => {
        const list = (g.id === "mine" ? mine : AGENTS.filter(a => a.category === g.id)).filter(match);
        if (!list.length) return null;
        return (
          <section key={g.id} className="group">
            <h2 className="group-title">{g.label}</h2>
            <ul className="inset-list">
              {list.map(a => (
                <li key={a.id}>
                  <button className="cell" onClick={() => onOpen(a)}>
                    <AppIcon name={a.icon} size={40} />
                    <span className="cell-text"><strong>{a.name}</strong><span>{a.who ?? a.does}</span></span>
                    <ChevronRight size={17} strokeWidth={2.4} className="chev" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {!only && <button className="capsule tinted full" onClick={onBuild}><Plus size={18} strokeWidth={2.4} /> Build Your Own Agent</button>}
    </div>
  );
}

function AgentDetail({ agent, onTry }: { agent: Agent; onTry: () => void }) {
  const group = agent.category === "mine" ? "Built by you" : CATEGORIES.find(c => c.id === agent.category)?.label;
  return (
    <div className="detail">
      <div className="store-head">
        <AppIcon name={agent.icon} size={96} />
        <div className="store-meta">
          <h2 className="title1">{agent.name}</h2>
          <p className="secondary">{agent.who ?? `For ${group?.toLowerCase()}`}</p>
          <button className="capsule primary small" onClick={onTry}>Open</button>
        </div>
      </div>
      <p className="body-lg">{agent.does}</p>
      <h3 className="group-title">What it will do</h3>
      <ul className="inset-list steps">
        {agent.plan.map((s, i) => <li key={s}><span className="step-n">{i + 1}</span><span>{s}</span></li>)}
      </ul>
      <h3 className="group-title">Try saying</h3>
      <button className="bubble" onClick={onTry}>“{agent.sample}”</button>
    </div>
  );
}

/* ---------------------------------- Screen 3: Voice / Text capture ---------------------------------- */

type SpeechRec = { start: () => void; stop: () => void; onresult: ((e: any) => void) | null; onend: (() => void) | null; onerror: ((e: any) => void) | null; interimResults: boolean; lang: string; continuous: boolean };

function Capture({ agents, fixedAgent, initialRequest = null }: { agents: Agent[]; fixedAgent: Agent | null; initialRequest?: string | null }) {
  const [mode, setMode] = useState<"voice" | "type">("voice");
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>(initialRequest ? { agent: routeRequest(initialRequest, agents), request: initialRequest } : null);
  const [approved, setApproved] = useState(false);
  const recRef = useRef<SpeechRec | null>(null);
  const demoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { recRef.current?.stop(); if (demoRef.current) clearInterval(demoRef.current); }, []);

  const submit = (request: string) => {
    const req = request.trim();
    if (!req) return;
    setResult({ agent: fixedAgent ?? routeRequest(req, agents), request: req });
    setApproved(false);
  };

  const runDemo = () => {
    const sample = (fixedAgent ?? AGENTS.find(a => a.id === "tasks")!).sample;
    let i = 0; setListening(true);
    demoRef.current = setInterval(() => {
      i += 2; setText(sample.slice(0, i));
      if (i >= sample.length) { clearInterval(demoRef.current!); setListening(false); submit(sample); }
    }, 55);
  };

  const startVoice = () => {
    setText(""); setResult(null);
    const W = window as any;
    const Ctor = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!Ctor) return runDemo();
    const rec: SpeechRec = new Ctor();
    rec.lang = "en-US"; rec.interimResults = true; rec.continuous = false;
    let finalText = "";
    rec.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t; else interim += t;
      }
      setText(finalText + interim);
    };
    rec.onend = () => { setListening(false); if (finalText) submit(finalText); };
    rec.onerror = () => { setListening(false); runDemo(); };
    recRef.current = rec; setListening(true); rec.start();
  };

  if (result) {
    return (
      <div className="result">
        <div className="you-said">{result.request}</div>
        <div className="handoff">
          <AppIcon name={result.agent.icon} size={36} />
          <p><span className="secondary">Apple Orbit handed this to</span><br /><strong>{result.agent.name}</strong></p>
        </div>
        <ul className="inset-list steps">
          {result.agent.plan.map((s, i) => <li key={s}><span className="step-n">{i + 1}</span><span>{s}</span></li>)}
        </ul>
        {approved ? (
          <p className="done"><span className="done-dot"><Check size={16} strokeWidth={3} /></span> {shortName(result.agent)} is on it.</p>
        ) : (
          <div className="actions">
            <button className="capsule primary" onClick={() => setApproved(true)}>Approve Plan</button>
            <button className="capsule gray" onClick={() => { setResult(null); setText(result.request); setMode("type"); }}>Edit</button>
          </div>
        )}
        <p className="footnote">Prototype: plans are sample steps. Nothing is booked or sent.</p>
      </div>
    );
  }

  return (
    <div className="capture">
      {fixedAgent && <div className="pill-agent"><AppIcon name={fixedAgent.icon} size={22} /> {fixedAgent.name}</div>}

      <div className="segmented" role="tablist" aria-label="Input method">
        <button role="tab" aria-selected={mode === "voice"} className={mode === "voice" ? "is-on" : ""} onClick={() => setMode("voice")}><Mic size={15} strokeWidth={2.4} /> Voice</button>
        <button role="tab" aria-selected={mode === "type"} className={mode === "type" ? "is-on" : ""} onClick={() => setMode("type")}><Keyboard size={15} strokeWidth={2.4} /> Type</button>
      </div>

      {mode === "voice" ? (
        <div className="voice">
          <button className="orb-btn" onClick={listening ? () => recRef.current?.stop() : startVoice} aria-label={listening ? "Stop listening" : "Start listening"}>
            <Orb size={150} live={listening} />
            <span className="orb-icon">{listening ? <Square size={26} fill="currentColor" /> : <Mic size={34} strokeWidth={2.2} />}</span>
          </button>
          <p className={`transcript ${text ? "has-text" : ""}`} aria-live="polite">
            {text || (listening ? "Listening…" : "Tap and talk")}
          </p>
          {!text && !listening && <p className="secondary center">Plans, reminders, questions. Say it the way you’d say it to a friend.</p>}
        </div>
      ) : (
        <div className="type">
          <textarea value={text} onChange={e => setText(e.target.value)} rows={5} placeholder="Ask Apple Orbit anything…" aria-label="Your request" />
          <button className="capsule primary full" onClick={() => submit(text)} disabled={!text.trim()}>Send</button>
        </div>
      )}

      {!fixedAgent && (
        <div className="suggest">
          {["Plan a weekend in Chicago", "Dinner ideas without dairy", "Science test on Friday"].map(s => (
            <button key={s} className="bubble" onClick={() => submit(s)}>{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- Screen 4: Build your own agent ---------------------------------- */

const ICON_CHOICES = ["bot", "sparkles", "heart", "leaf", "plane", "chef", "dumbbell", "book", "music", "camera", "briefcase", "brain"];
const AUDIENCES: { id: CategoryId; label: string }[] = [
  { id: "everyone", label: "Family" }, { id: "students", label: "Student" },
  { id: "accessibility", label: "Access" }, { id: "professionals", label: "Work" },
];
const PERMISSIONS: { id: string; icon: string; I: IconType }[] = [
  { id: "Calendar", icon: "calendarCheck", I: Calendar }, { id: "Reminders", icon: "listTodo", I: Bell },
  { id: "Messages", icon: "message", I: MessageSquare }, { id: "Photos", icon: "sparkles", I: Camera },
  { id: "Health", icon: "heart", I: Heart }, { id: "Location", icon: "plane", I: MapPin },
];
const TONES = ["Friendly", "Brief", "Upbeat", "Formal"];

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button role="switch" aria-checked={on} aria-label={label} className={`switch ${on ? "is-on" : ""}`} onClick={() => onChange(!on)}><span /></button>;
}

function BuildScreen({ onCreate, demo = false }: { onCreate: (a: Agent) => void; demo?: boolean }) {
  const [name, setName] = useState(demo ? "Plant Care" : "");
  const [icon, setIcon] = useState(demo ? "leaf" : "sparkles");
  const [does, setDoes] = useState("");
  const [audience, setAudience] = useState<CategoryId>("everyone");
  const [perms, setPerms] = useState<string[]>(["Reminders"]);
  const [tone, setTone] = useState("Friendly");
  const [confirm, setConfirm] = useState(true);

  const valid = name.trim().length > 1 && does.trim().length > 10;
  const setPerm = (p: string, on: boolean) => setPerms(ps => on ? [...ps, p] : ps.filter(x => x !== p));

  const create = () => {
    const words = does.toLowerCase().match(/[a-z]{4,}/g) ?? [];
    onCreate({
      id: `mine-${Date.now()}`, name: /agent$/i.test(name.trim()) ? name.trim() : `${name.trim()} Agent`,
      category: "mine", icon, does: does.trim(),
      keywords: Array.from(new Set(words)).slice(0, 12),
      plan: [
        `Understand your request (${tone.toLowerCase()} tone)`,
        perms.length ? `Use ${perms.join(", ")} to get it done` : "Work only with what you tell it",
        confirm ? "Ask you before taking any action" : "Act, then tell you what it did",
      ],
      sample: does.trim().split(/[.!?]/)[0].slice(0, 60),
    });
  };

  return (
    <div className="page">
      <h1 className="largetitle">New Agent</h1>

      <div className="build-preview">
        <AppIcon name={icon} size={88} />
        <strong>{name.trim() || "Untitled"}</strong>
        <span className="secondary">{AUDIENCES.find(a => a.id === audience)?.label} · {tone}</span>
      </div>

      <div className="icon-pick" role="radiogroup" aria-label="Icon">
        {ICON_CHOICES.map(i => (
          <button key={i} role="radio" aria-checked={icon === i} className={icon === i ? "is-on" : ""} onClick={() => setIcon(i)} aria-label={i}><AppIcon name={i} size={36} /></button>
        ))}
      </div>

      <h3 className="group-title">Details</h3>
      <div className="inset-list form">
        <label className="form-row"><span>Name</span><input value={name} onChange={e => setName(e.target.value)} placeholder="Plant Care" maxLength={40} /></label>
        <label className="form-row stack"><span>What should it do?</span><textarea rows={3} value={does} onChange={e => setDoes(e.target.value)} placeholder="Remind me to water each plant based on its type, and tell me when to repot." /></label>
      </div>

      <h3 className="group-title">Who is it for</h3>
      <div className="segmented">{AUDIENCES.map(a => <button key={a.id} className={audience === a.id ? "is-on" : ""} onClick={() => setAudience(a.id)}>{a.label}</button>)}</div>

      <h3 className="group-title">Access</h3>
      <ul className="inset-list">
        {PERMISSIONS.map(p => (
          <li key={p.id} className="cell static">
            <AppIcon name={p.icon} size={30} />
            <span className="cell-text"><strong>{p.id}</strong></span>
            <Switch on={perms.includes(p.id)} onChange={v => setPerm(p.id, v)} label={`Allow ${p.id}`} />
          </li>
        ))}
      </ul>

      <h3 className="group-title">Personality</h3>
      <div className="segmented">{TONES.map(t => <button key={t} className={tone === t ? "is-on" : ""} onClick={() => setTone(t)}>{t}</button>)}</div>

      <ul className="inset-list" style={{ marginTop: 22 }}>
        <li className="cell static">
          <span className="cell-text"><strong>Ask Before Acting</strong><span>Confirm before sending, booking, or buying.</span></span>
          <Switch on={confirm} onChange={setConfirm} label="Ask before acting" />
        </li>
      </ul>

      <button className="capsule primary full" disabled={!valid} onClick={create}>Create Agent</button>
      {!valid && <p className="footnote center">Add a name and a sentence about what it should do.</p>}
    </div>
  );
}

/* ---------------------------------- Liquid Glass sheet ---------------------------------- */

function Sheet({ title, onClose, tall, hideTitle, children }: { title: string; onClose: () => void; tall?: boolean; hideTitle?: boolean; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="scrim" onClick={onClose}>
      <div className={`sheet ${tall ? "tall" : ""}`} role="dialog" aria-modal="true" aria-label={title} onClick={e => e.stopPropagation()}>
        <div className="grabber" aria-hidden="true" />
        <div className="sheet-bar">
          <span />
          {hideTitle ? <span /> : <h2 className="headline">{title}</h2>}
          <button className="glass close" onClick={onClose} aria-label="Close"><X size={18} strokeWidth={2.6} /></button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}
