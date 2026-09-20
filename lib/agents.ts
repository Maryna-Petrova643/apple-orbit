// Agent catalog. Content comes from the "AI Agent" requirements doc.
// To add an agent: add an entry here. The library, search, and voice routing pick it up automatically.

export type CategoryId = "everyone" | "students" | "accessibility" | "professionals" | "mine";

export type Agent = {
  id: string;
  name: string;
  category: CategoryId;
  icon: string;          // key into the icon map in components/AgentsApp.tsx
  does: string;          // "What it would do"
  who?: string;          // "Who it helps" (accessibility agents)
  keywords: string[];    // words that route a voice/typed request to this agent
  plan: string[];        // demo steps the agent proposes after a request
  sample: string;        // example request shown in the UI
};

export const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  { id: "everyone", label: "Everyone", blurb: "Everyday help for trips, tasks, meals, and fitness." },
  { id: "students", label: "Students", blurb: "Learning support at the right grade level." },
  { id: "accessibility", label: "Accessibility", blurb: "Agents that adapt the iPhone to the way you live." },
  { id: "professionals", label: "Professionals", blurb: "Keep work and life organized." },
];

export const AGENTS: Agent[] = [
  // ---------- Agents for Everyone ----------
  {
    id: "travel", name: "Travel Agent", category: "everyone", icon: "plane",
    does: "Plan and organize trips, including flights, hotels, itineraries, reservations, and travel reminders.",
    keywords: ["trip", "travel", "flight", "hotel", "vacation", "itinerary", "fly", "booking", "weekend in", "getaway", "visit", "plan a weekend"],
    plan: ["Compare flight options for your dates", "Shortlist three hotels near your plans", "Build a day-by-day itinerary", "Add check-in and packing reminders"],
    sample: "Plan a 4-day trip to Lisbon in May",
  },
  {
    id: "tasks", name: "Task Tracker & Voice Memo Agent", category: "everyone", icon: "mic",
    does: "Capture tasks through voice, organize kids' games, appointments, meetings, and important events, and provide reminders.",
    keywords: ["remind", "reminder", "task", "game", "appointment", "memo", "remember", "practice", "pickup"],
    plan: ["Turn what you said into separate tasks", "Put events on your calendar", "Set reminders the day before and 1 hour before"],
    sample: "Soccer game Saturday at 10, dentist Tuesday at 3",
  },
  {
    id: "meals", name: "Meal Planning & Recipe Agent", category: "everyone", icon: "chef",
    does: "Create weekly meal plans and recommend recipes based on what the user likes and dislikes.",
    keywords: ["meal", "recipe", "dinner", "lunch", "cook", "grocery", "food", "breakfast"],
    plan: ["Draft a 7-day meal plan from your likes and dislikes", "Suggest recipes for each day", "Create a grocery list in Reminders"],
    sample: "Easy dinners this week, no mushrooms",
  },
  {
    id: "fitness", name: "Fitness Agent", category: "everyone", icon: "dumbbell",
    does: "Create personalized workouts, track fitness goals and progress, and provide reminders to stay active.",
    keywords: ["workout", "fitness", "exercise", "run", "gym", "steps", "active", "training"],
    plan: ["Check your recent activity", "Build a weekly workout plan for your goal", "Schedule move reminders"],
    sample: "Three 30-minute workouts a week to build strength",
  },

  // ---------- Agents for Students ----------
  {
    id: "homework", name: "Homework Tutor Agent", category: "students", icon: "graduation",
    does: "Explain math, science, reading, and other subjects at the student's grade level, provide hints, and create practice questions.",
    keywords: ["homework", "math", "science", "explain", "fractions", "equation", "tutor"],
    plan: ["Explain the idea at your grade level", "Walk through one example with hints", "Create five practice questions"],
    sample: "Help me understand fractions, 4th grade",
  },
  {
    id: "study", name: "Study Coach Agent", category: "students", icon: "calendarCheck",
    does: "Review assignments and upcoming tests and create personalized study plans and reminders.",
    keywords: ["study", "test", "exam", "quiz", "assignment", "due", "test on", "prepare", "upcoming test"],
    plan: ["List upcoming tests and assignments", "Split study time into daily sessions", "Add reminders before each session"],
    sample: "Science test on Friday, help me prepare",
  },
  {
    id: "reading", name: "Reading Companion Agent", category: "students", icon: "book",
    does: "Help students with difficult words, ask comprehension questions, and recommend age-appropriate books.",
    keywords: ["read", "reading", "book", "word", "story", "chapter"],
    plan: ["Explain tricky words as you read", "Ask comprehension questions after each chapter", "Recommend books at your level"],
    sample: "What does 'reluctant' mean in chapter 3?",
  },
  {
    id: "creative", name: "Creative Learning Agent", category: "students", icon: "sparkles",
    does: "Turn a student's interests into engaging learning activities, for example teaching multiplication using dinosaurs.",
    keywords: ["fun", "dinosaur", "game", "activity", "creative", "interest"],
    plan: ["Pick a topic you love", "Turn the lesson into a story or game", "Finish with a quick challenge"],
    sample: "Teach me multiplication with dinosaurs",
  },
  {
    id: "language", name: "Language Assistant Agent", category: "students", icon: "languages",
    does: "Translate between languages, explain unfamiliar words and phrases, and help students practice communicating in another language.",
    keywords: ["translate", "spanish", "french", "language", "phrase", "say", "german"],
    plan: ["Translate your phrase", "Explain the grammar and tone", "Practice a short conversation with you"],
    sample: "How do I ask for directions in Spanish?",
  },

  // ---------- Agents for people with disabilities ----------
  {
    id: "vision", name: "Vision Assistant Agent", category: "accessibility", icon: "eye", who: "Blind / low-vision users",
    does: "Describe surroundings, read signs and menus, identify objects, summarize documents, and help navigate.",
    keywords: ["see", "read this", "menu", "sign", "describe", "vision"],
    plan: ["Open the camera", "Describe what's in front of you", "Read text aloud and summarize it"],
    sample: "Read this menu to me",
  },
  {
    id: "hearing", name: "Hearing Assistant Agent", category: "accessibility", icon: "ear", who: "Deaf / hard-of-hearing users",
    does: "Live transcription, summarize conversations, and identify important sounds such as alarms or doorbells.",
    keywords: ["transcribe", "caption", "hear", "doorbell", "alarm", "conversation"],
    plan: ["Start live captions", "Alert you to doorbells and alarms", "Summarize the conversation afterwards"],
    sample: "Caption this meeting and summarize it",
  },
  {
    id: "communication", name: "Communication Agent", category: "accessibility", icon: "message", who: "Users with speech disabilities",
    does: "Turn typed text, gestures, or abbreviated phrases into natural speech and help communicate during calls.",
    keywords: ["speak for me", "call", "speech", "say this"],
    plan: ["Expand your short phrase into a full sentence", "Speak it in your chosen voice", "Stay on the call to help"],
    sample: "Call pharmacy, refill ready?",
  },
  {
    id: "mobility", name: "Mobility Assistant Agent", category: "accessibility", icon: "hand", who: "Users with limited hand or physical mobility",
    does: "Operate the iPhone through voice: open apps, compose messages, manage appointments, adjust settings, and execute multi-step tasks.",
    keywords: ["open", "send a message", "turn on", "settings", "text"],
    plan: ["Understand the multi-step request", "Do each step by voice", "Confirm before sending anything"],
    sample: "Text Mom I'm running 10 minutes late",
  },
  {
    id: "cognitive", name: "Cognitive Support Agent", category: "accessibility", icon: "brain", who: "Users with cognitive or learning disabilities",
    does: "Break tasks into steps, simplify information, provide reminders, and guide routines.",
    keywords: ["steps", "routine", "simplify", "confusing", "help me do"],
    plan: ["Break the task into small steps", "Show one step at a time", "Remind you of your daily routine"],
    sample: "Help me do my morning routine",
  },
  {
    id: "navigation", name: "Accessibility Navigation Agent", category: "accessibility", icon: "accessibility", who: "Users with mobility or vision disabilities",
    does: "Find accessible entrances and routes, elevators, ramps, and accessible transit, and provide contextual navigation.",
    keywords: ["entrance", "ramp", "elevator", "wheelchair", "route", "accessible"],
    plan: ["Find step-free routes", "Locate accessible entrances and elevators", "Guide you turn by turn"],
    sample: "Step-free route to the library",
  },
  {
    id: "personal-access", name: "Personal Accessibility Agent", category: "accessibility", icon: "sliders", who: "Broad accessibility needs",
    does: "Learn the user's preferred accessibility settings and automatically adapt text size, contrast, VoiceOver, captions, interaction methods, and more.",
    keywords: ["text size", "contrast", "voiceover", "bigger", "captions"],
    plan: ["Learn which settings help you most", "Adjust them automatically by situation", "Ask before big changes"],
    sample: "Make text bigger at night",
  },

  // ---------- Agents for busy professionals ----------
  {
    id: "executive", name: "Executive Assistant Agent", category: "professionals", icon: "briefcase",
    does: "Manage calendar, schedule meetings, resolve conflicts, prepare a daily agenda, and remind users about priorities.",
    keywords: ["meeting", "schedule", "calendar", "agenda", "conflict", "minutes with", "find time", "next week", "availability"],
    plan: ["Check your calendar for conflicts", "Propose meeting times", "Send you a morning agenda"],
    sample: "Find 30 minutes with Sam next week",
  },
  {
    id: "priority", name: "Task & Priority Agent", category: "professionals", icon: "listTodo",
    does: "Turn emails, messages, and meeting notes into tasks and continuously organize priorities.",
    keywords: ["priority", "priorities", "email", "notes", "to-do", "todo"],
    plan: ["Scan today's emails and notes", "Extract tasks with deadlines", "Rank them by urgency"],
    sample: "What should I focus on today?",
  },
  {
    id: "admin", name: "Personal Admin Agent", category: "professionals", icon: "clipboard",
    does: "Handle appointments, reservations, reminders, bills, deliveries, and other personal tasks that compete with work.",
    keywords: ["bill", "delivery", "reservation", "package", "pay", "book a table"],
    plan: ["Collect the personal tasks due this week", "Book what can be booked", "Remind you about bills and deliveries"],
    sample: "Remind me to pay the electric bill Friday",
  },
];

/** Pick the agent whose keywords best match a request. Falls back to the task agent. */
export function routeRequest(text: string, agents: Agent[] = AGENTS): Agent {
  const t = text.toLowerCase();
  let best = agents.find(a => a.id === "tasks") ?? agents[0];
  let bestScore = 0;
  for (const a of agents) {
    const score = a.keywords.reduce((s, k) => s + (t.includes(k) ? k.length : 0), 0);
    if (score > bestScore) { best = a; bestScore = score; }
  }
  return best;
}
