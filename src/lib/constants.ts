import {
  BadgeHelp,
  Briefcase,
  Bus,
  CalendarClock,
  Coffee,
  GraduationCap,
  HandHelping,
  HeartHandshake,
  Home,
  Hotel,
  Landmark,
  Library,
  LucideIcon,
  MessageCircle,
  PartyPopper,
  Phone,
  Plane,
  Presentation,
  ScanSearch,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Stethoscope,
  Store,
  Ticket,
  TrainFront,
  UserPlus,
  Users,
  UtensilsCrossed,
  WalletCards,
  Wrench,
} from "lucide-react";
import type {
  AssessmentAnswer,
  Difficulty,
  Level,
  Mode,
  PronunciationExercise,
  Scenario,
  ScenarioWithIcon,
} from "@/types";

export const STORAGE_KEY = "fluentia_app_state";
export const WARNINGS_KEY = "fluentia_warnings";

export const assessmentQuestions = [
  {
    id: "grammar",
    kind: "mcq",
    category: "Grammar",
    prompt: "Choose the correct sentence.",
    options: [
      "She go to school every day.",
      "She goes to school every day.",
      "She going to school every day.",
      "She gone to school every day.",
    ],
    correct: "She goes to school every day.",
  },
  {
    id: "vocabulary",
    kind: "mcq",
    category: "Vocabulary",
    prompt: "Which word best fits? I am very _____ for your help.",
    options: ["angry", "grateful", "late", "heavy"],
    correct: "grateful",
  },
  {
    id: "fluency",
    kind: "text",
    category: "Fluency",
    prompt: "Describe your morning routine in 2-3 sentences.",
  },
  {
    id: "pronunciation",
    kind: "choice",
    category: "Pronunciation Confidence",
    prompt: "How confident are you speaking English aloud?",
    options: ["Not very", "Somewhat", "Very confident"],
  },
  {
    id: "composition",
    kind: "text",
    category: "Composition",
    prompt: "Introduce yourself as if meeting a new colleague.",
  },
] as const;

const iconMap = {
  BadgeHelp,
  Briefcase,
  Bus,
  CalendarClock,
  Coffee,
  GraduationCap,
  HandHelping,
  HeartHandshake,
  Home,
  Hotel,
  Landmark,
  Library,
  MessageCircle,
  PartyPopper,
  Phone,
  Plane,
  Presentation,
  ScanSearch,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Stethoscope,
  Store,
  Ticket,
  TrainFront,
  UserPlus,
  Users,
  UtensilsCrossed,
  WalletCards,
  Wrench,
} satisfies Record<string, LucideIcon>;

type ScenarioSeed = {
  id: string;
  title: string;
  description: string;
  category: string;
  iconName: keyof typeof iconMap;
  goals: string[];
  starterPrompts: string[];
  followUpPrompts: string[];
  culturalNotes: string[];
  voiceSample: string;
};

const formalBeginnerSeeds: ScenarioSeed[] = [
  {
    id: "formal-beginner-job-intro",
    title: "Interview Introduction",
    description: "Practice a clear first answer in a simple interview.",
    category: "Work",
    iconName: "Briefcase",
    goals: ["Introduce yourself", "Name one strength", "Sound calm and polite"],
    starterPrompts: [
      "Welcome. Please introduce yourself and tell me one strength you would bring to this role.",
      "Thanks for joining us. Start with your name, background, and one reason this role interests you.",
    ],
    followUpPrompts: [
      "Can you share one example that shows this strength in action?",
      "What kind of work environment helps you do your best?",
    ],
    culturalNotes: [
      "A short, clear answer often sounds stronger than a long list of qualities.",
      "In interviews, specific examples usually sound more credible than general claims.",
    ],
    voiceSample: "Thank you for meeting with me. I am a reliable learner who enjoys helping teams stay organized.",
  },
  {
    id: "formal-beginner-class-question",
    title: "Class Question",
    description: "Answer a teacher with a simple explanation.",
    category: "Education",
    iconName: "GraduationCap",
    goals: ["State your idea", "Add one reason", "Use respectful classroom language"],
    starterPrompts: [
      "Your teacher asks what you understood from today's lesson. Answer clearly.",
      "Please explain your answer to the teacher in two or three clear sentences.",
    ],
    followUpPrompts: [
      "Can you add one example from class?",
      "What part of the lesson was easiest for you to understand?",
    ],
    culturalNotes: [
      "Phrases like 'I think' or 'From my understanding' can sound thoughtful in class.",
      "Teachers usually appreciate direct answers before extra detail.",
    ],
    voiceSample: "I think the main idea is that regular practice helps students remember the lesson for longer.",
  },
  {
    id: "formal-beginner-office-help",
    title: "Office Help Request",
    description: "Ask a coworker for help respectfully.",
    category: "Work",
    iconName: "HandHelping",
    goals: ["Ask politely", "Explain the task", "Say what support you need"],
    starterPrompts: [
      "You need help with a task at work. Ask a coworker politely.",
      "Explain what you are trying to do and ask for support in a professional way.",
    ],
    followUpPrompts: [
      "What have you already tried?",
      "How urgent is this request?",
    ],
    culturalNotes: [
      "Professional requests often sound natural with 'Could you help me with...?'",
      "Brief context helps the other person respond faster.",
    ],
    voiceSample: "Could you help me review this report? I finished the draft, but I want to make sure the summary is clear.",
  },
  {
    id: "formal-beginner-meeting-update",
    title: "Meeting Update",
    description: "Give a short progress update in a team meeting.",
    category: "Work",
    iconName: "Presentation",
    goals: ["State progress", "Mention one next step", "Keep a steady formal tone"],
    starterPrompts: [
      "It is your turn in a team meeting. Share a brief update on your work.",
      "Give a short status update and explain your next step.",
    ],
    followUpPrompts: [
      "Is there anything blocking your progress?",
      "What will you finish by the end of the day?",
    ],
    culturalNotes: [
      "Simple signposts like 'So far' and 'Next' help updates sound organized.",
      "Short meeting updates are often preferred to long explanations.",
    ],
    voiceSample: "So far, I have completed the first draft and checked the main numbers. Next, I will review the final section with my manager.",
  },
  {
    id: "formal-beginner-email-summary",
    title: "Email Summary",
    description: "Speak as if you are summarizing a polite email.",
    category: "Work",
    iconName: "MessageCircle",
    goals: ["Explain the purpose", "Mention one request", "Sound clear and courteous"],
    starterPrompts: [
      "Imagine you are summarizing a professional email aloud. What does it say?",
      "Tell a teammate the main point of your email and what action you need.",
    ],
    followUpPrompts: [
      "What deadline should the listener remember?",
      "How would you close the message politely?",
    ],
    culturalNotes: [
      "Professional English often sounds smoother when the purpose is stated early.",
      "Closing with appreciation can sound warm without being overly formal.",
    ],
    voiceSample: "I am writing to confirm tomorrow's schedule and ask for your feedback on the final draft before noon.",
  },
  {
    id: "formal-beginner-front-desk",
    title: "Front Desk Check-In",
    description: "Handle a simple formal check-in at a desk or office.",
    category: "Services",
    iconName: "Hotel",
    goals: ["State your name", "Explain why you are there", "Ask one polite question"],
    starterPrompts: [
      "You arrive at a reception desk. Introduce yourself and explain your appointment.",
      "Check in politely and confirm what you need next.",
    ],
    followUpPrompts: [
      "Do you need to show any documents?",
      "How would you ask where to wait?",
    ],
    culturalNotes: [
      "Reception conversations often sound natural with calm, short sentences.",
      "Saying your purpose early helps staff assist you quickly.",
    ],
    voiceSample: "Good morning. My name is Asha Patel, and I have a ten o'clock appointment with the training team.",
  },
  {
    id: "formal-beginner-phone-message",
    title: "Phone Message",
    description: "Leave a short professional voice message.",
    category: "Communication",
    iconName: "Phone",
    goals: ["Introduce yourself", "Explain why you called", "Request a callback"],
    starterPrompts: [
      "Leave a short professional voice message for a colleague.",
      "Say who you are, why you are calling, and what you need next.",
    ],
    followUpPrompts: [
      "What is the best time to call you back?",
      "How can you sound polite but concise?",
    ],
    culturalNotes: [
      "Voicemails are usually clearest when you say your name twice.",
      "A slow pace helps with names, numbers, and contact details.",
    ],
    voiceSample: "Hello, this is Daniel Kim from the support team. I am calling about tomorrow's client meeting, so please call me back this afternoon.",
  },
  {
    id: "formal-beginner-training-intro",
    title: "Training Introduction",
    description: "Introduce yourself at a workplace training session.",
    category: "Work",
    iconName: "UserPlus",
    goals: ["Say your role", "Share one learning goal", "Sound confident and friendly"],
    starterPrompts: [
      "Introduce yourself at the start of a training session.",
      "Tell the group your role and one thing you want to learn today.",
    ],
    followUpPrompts: [
      "Why is this training useful for you?",
      "What skill do you want to improve most?",
    ],
    culturalNotes: [
      "A simple structure like name, role, goal sounds polished and easy to follow.",
      "A modest, specific learning goal often sounds stronger than a broad one.",
    ],
    voiceSample: "Hello everyone. I work in customer support, and I hope to improve how I handle difficult conversations more confidently.",
  },
  {
    id: "formal-beginner-bank-visit",
    title: "Bank Visit",
    description: "Handle a practical conversation in a formal service setting.",
    category: "Services",
    iconName: "WalletCards",
    goals: ["Explain your need", "Ask one question", "Use polite service language"],
    starterPrompts: [
      "You are speaking to a bank representative. Explain what help you need.",
      "Describe your request clearly and ask what the next step is.",
    ],
    followUpPrompts: [
      "What documents do you have with you?",
      "How would you ask about processing time?",
    ],
    culturalNotes: [
      "Service conversations often sound natural with 'I would like to...' rather than 'I want...'.",
      "Clear questions help avoid confusion in formal settings.",
    ],
    voiceSample: "I would like to update my account details, and I would also like to know how long the process usually takes.",
  },
  {
    id: "formal-beginner-library-card",
    title: "Library Registration",
    description: "Register for a service with clear, careful language.",
    category: "Education",
    iconName: "Library",
    goals: ["State your purpose", "Share one detail", "Ask about the process"],
    starterPrompts: [
      "You are registering for a library card. Explain what you need.",
      "Speak to the librarian and ask how to complete the registration.",
    ],
    followUpPrompts: [
      "How would you ask about borrowing limits?",
      "What information should you confirm before you leave?",
    ],
    culturalNotes: [
      "Questions with 'Could you tell me...' sound polite and natural in public service settings.",
      "Short check-in questions can make you sound prepared and organized.",
    ],
    voiceSample: "Hello. I am here to register for a library card, and I would like to know what documents I need to bring.",
  },
];

const formalIntermediateSeeds: ScenarioSeed[] = [
  {
    id: "formal-intermediate-panel-interview",
    title: "Panel Interview",
    description: "Handle a more detailed interview response with evidence.",
    category: "Work",
    iconName: "Briefcase",
    goals: ["Connect experience to results", "Use structured answers", "Sound composed under pressure"],
    starterPrompts: [
      "Please describe a project that shows how you solve problems effectively.",
      "Answer like you are speaking to a hiring panel and connect your experience to measurable impact.",
    ],
    followUpPrompts: [
      "What challenge did you face and how did you respond?",
      "How would your teammates describe your contribution?",
    ],
    culturalNotes: [
      "STAR-style answers can sound especially strong in formal interviews.",
      "Clear outcomes sound more persuasive than vague effort alone.",
    ],
    voiceSample: "In my last role, I streamlined our reporting process and reduced weekly preparation time by nearly thirty percent.",
  },
  {
    id: "formal-intermediate-client-call",
    title: "Client Status Call",
    description: "Update a client with clarity and reassurance.",
    category: "Work",
    iconName: "Phone",
    goals: ["Explain status clearly", "Acknowledge concerns", "Set expectations"],
    starterPrompts: [
      "A client asks for an update on a shared project. Respond professionally.",
      "Give a calm status update and explain what happens next.",
    ],
    followUpPrompts: [
      "How would you handle a delayed deadline?",
      "What reassurance can you offer without overpromising?",
    ],
    culturalNotes: [
      "Client calls often sound stronger when risks and next steps are both addressed directly.",
      "Phrases like 'what we can commit to today is...' help set realistic expectations.",
    ],
    voiceSample: "We have completed the testing phase, and the remaining work is focused on the final review and delivery timeline.",
  },
  {
    id: "formal-intermediate-project-pitch",
    title: "Project Pitch",
    description: "Present a concise idea to a manager or stakeholder.",
    category: "Work",
    iconName: "Presentation",
    goals: ["Open with value", "Explain one recommendation", "Invite discussion professionally"],
    starterPrompts: [
      "Pitch a small project idea to your manager and explain why it matters.",
      "Introduce your proposal, the benefit, and the first step.",
    ],
    followUpPrompts: [
      "What evidence supports your idea?",
      "How would you respond to a concern about budget or time?",
    ],
    culturalNotes: [
      "Decision-makers often respond well to clear tradeoffs and realistic first steps.",
      "A short preview of benefits can help listeners stay engaged.",
    ],
    voiceSample: "I would like to propose a simpler onboarding guide that reduces repeated support questions and saves time for new hires.",
  },
  {
    id: "formal-intermediate-feedback-meeting",
    title: "Performance Feedback",
    description: "Respond thoughtfully during a feedback conversation.",
    category: "Work",
    iconName: "ShieldCheck",
    goals: ["Show reflection", "Ask a useful follow-up", "Keep a growth mindset tone"],
    starterPrompts: [
      "Your manager has given you feedback. Respond professionally and reflect on it.",
      "Acknowledge the feedback and explain how you will act on it.",
    ],
    followUpPrompts: [
      "What support would help you improve faster?",
      "How would you summarize the action plan at the end?",
    ],
    culturalNotes: [
      "Reflective responses often sound stronger than defensive ones in feedback meetings.",
      "A good follow-up question can show maturity and ownership.",
    ],
    voiceSample: "Thank you for the feedback. I understand the main concern, and I would like to focus on improving how I prioritize urgent requests.",
  },
  {
    id: "formal-intermediate-networking",
    title: "Professional Networking",
    description: "Make a polished introduction at a professional event.",
    category: "Career",
    iconName: "Users",
    goals: ["Introduce your background", "Ask a relevant question", "Build rapport naturally"],
    starterPrompts: [
      "You are meeting a new professional contact at an event. Start the conversation.",
      "Introduce yourself, mention your work, and ask a thoughtful follow-up question.",
    ],
    followUpPrompts: [
      "How would you continue the conversation if they seem interested?",
      "What would you say before exchanging contact details?",
    ],
    culturalNotes: [
      "Professional networking often feels smoother when you focus on shared interests instead of self-promotion alone.",
      "Questions about the other person's work can sound more engaging than long introductions.",
    ],
    voiceSample: "Hi, I work in product operations, and I am especially interested in how teams improve collaboration across different departments.",
  },
  {
    id: "formal-intermediate-mentor-checkin",
    title: "Mentor Check-In",
    description: "Discuss your progress with a mentor in a thoughtful way.",
    category: "Career",
    iconName: "HeartHandshake",
    goals: ["Reflect on progress", "Ask for guidance", "Describe a challenge clearly"],
    starterPrompts: [
      "Your mentor asks how your development is going. Give a clear update.",
      "Explain one thing that is going well and one area where you need advice.",
    ],
    followUpPrompts: [
      "What kind of feedback would help you most?",
      "How have you applied previous advice?",
    ],
    culturalNotes: [
      "Mentoring conversations often sound strongest when they balance honesty with initiative.",
      "Naming a specific challenge can lead to more useful advice.",
    ],
    voiceSample: "I feel more confident leading small meetings now, but I would appreciate advice on speaking more clearly when the discussion becomes complex.",
  },
  {
    id: "formal-intermediate-campus-presentation",
    title: "Campus Presentation",
    description: "Present an idea clearly in an academic setting.",
    category: "Education",
    iconName: "Presentation",
    goals: ["Open with context", "Explain one key argument", "Guide the audience"],
    starterPrompts: [
      "You are opening a short classroom presentation. Introduce your topic and its importance.",
      "Start your presentation with context, purpose, and a quick preview.",
    ],
    followUpPrompts: [
      "How would you handle a question from the audience?",
      "What example would make your point clearer?",
    ],
    culturalNotes: [
      "Academic presentations often sound stronger with a signpost like 'I will focus on two key points today.'",
      "A calm pace helps listeners follow unfamiliar information.",
    ],
    voiceSample: "Today I will explain why community-based learning improves both student engagement and long-term confidence.",
  },
  {
    id: "formal-intermediate-problem-report",
    title: "Issue Escalation",
    description: "Report a workplace issue without sounding emotional or vague.",
    category: "Work",
    iconName: "Wrench",
    goals: ["Describe the issue", "Explain impact", "Recommend the next step"],
    starterPrompts: [
      "A process is failing and you need to escalate it to a manager. Explain the issue clearly.",
      "Report the problem, its impact, and what support you need next.",
    ],
    followUpPrompts: [
      "What evidence would strengthen your report?",
      "How would you phrase urgency without sounding dramatic?",
    ],
    culturalNotes: [
      "Escalations usually sound most effective when they focus on facts, impact, and next actions.",
      "It can help to separate the problem from any personal frustration.",
    ],
    voiceSample: "The approval queue has been delayed for two days, which is now affecting delivery timelines for three client requests.",
  },
  {
    id: "formal-intermediate-service-complaint",
    title: "Formal Complaint",
    description: "Raise a concern firmly but respectfully.",
    category: "Services",
    iconName: "BadgeHelp",
    goals: ["State the issue clearly", "Describe the expected resolution", "Stay professional"],
    starterPrompts: [
      "You need to make a formal complaint about a service problem. Explain it calmly.",
      "Describe what happened and what outcome you would consider fair.",
    ],
    followUpPrompts: [
      "How would you respond if the first answer is not helpful?",
      "What details make your complaint sound credible?",
    ],
    culturalNotes: [
      "A calm tone can sound more persuasive than an angry tone in formal complaints.",
      "Specific details help service staff understand the problem faster.",
    ],
    voiceSample: "I would like to report an issue with my reservation because the confirmation details did not match the service I received.",
  },
  {
    id: "formal-intermediate-policy-question",
    title: "Policy Clarification",
    description: "Ask for clarification in a precise, professional way.",
    category: "Work",
    iconName: "ScanSearch",
    goals: ["Ask a focused question", "Reference context", "Confirm understanding"],
    starterPrompts: [
      "You need clarification on a workplace policy. Ask professionally.",
      "Explain what part of the policy is unclear and what you need to confirm.",
    ],
    followUpPrompts: [
      "How would you summarize the answer back to confirm understanding?",
      "What background detail would make your question easier to answer?",
    ],
    culturalNotes: [
      "Focused questions often get better answers than broad questions in formal settings.",
      "Repeating back the main point can help avoid misunderstandings.",
    ],
    voiceSample: "I wanted to clarify the travel reimbursement policy, especially which expenses need approval before the trip.",
  },
];

const formalAdvancedSeeds: ScenarioSeed[] = [
  {
    id: "formal-advanced-executive-presentation",
    title: "Executive Presentation",
    description: "Present a recommendation to senior leaders with strong structure.",
    category: "Leadership",
    iconName: "Presentation",
    goals: ["Open with impact", "Frame tradeoffs", "Speak with authority and clarity"],
    starterPrompts: [
      "Present a recommendation to senior leaders and explain why it matters now.",
      "Open with the problem, the recommendation, and the business impact.",
    ],
    followUpPrompts: [
      "What tradeoffs would you address if questioned?",
      "How would you close with a decision request?",
    ],
    culturalNotes: [
      "Senior audiences often value brevity, clarity, and decision-ready framing.",
      "Confident transitions can make complex ideas easier to trust.",
    ],
    voiceSample: "My recommendation is to simplify the rollout into two phases so we reduce delivery risk while protecting the customer experience.",
  },
  {
    id: "formal-advanced-stakeholder-negotiation",
    title: "Stakeholder Negotiation",
    description: "Navigate disagreement while preserving alignment.",
    category: "Leadership",
    iconName: "HeartHandshake",
    goals: ["Acknowledge concerns", "Reframe toward shared goals", "Negotiate calmly"],
    starterPrompts: [
      "A stakeholder disagrees with your plan. Respond diplomatically and persuasively.",
      "Address the concern, protect the relationship, and propose a constructive path forward.",
    ],
    followUpPrompts: [
      "How would you respond if they still resist?",
      "Which shared goal can you emphasize to move the discussion forward?",
    ],
    culturalNotes: [
      "Negotiation often sounds strongest when you validate the concern before arguing your case.",
      "Shared-goal language can reduce defensiveness in formal discussions.",
    ],
    voiceSample: "I understand the concern about timing, and I think we can protect the deadline by narrowing scope rather than lowering quality.",
  },
  {
    id: "formal-advanced-crisis-briefing",
    title: "Crisis Briefing",
    description: "Explain a sensitive situation with precision and control.",
    category: "Leadership",
    iconName: "ShieldCheck",
    goals: ["State facts first", "Manage urgency", "Project calm leadership"],
    starterPrompts: [
      "You need to brief leadership on a high-risk issue. Speak clearly and calmly.",
      "Explain the situation, immediate impact, and the next decision needed.",
    ],
    followUpPrompts: [
      "How would you answer a tough question about accountability?",
      "What information should you avoid speculating about?",
    ],
    culturalNotes: [
      "In crisis briefings, clear facts and next steps matter more than dramatic language.",
      "Separating confirmed facts from assumptions builds trust.",
    ],
    voiceSample: "At this stage, we have confirmed the service interruption, identified the affected customers, and launched the mitigation plan.",
  },
  {
    id: "formal-advanced-conference-qa",
    title: "Conference Q&A",
    description: "Answer a challenging question in public with confidence.",
    category: "Public Speaking",
    iconName: "Users",
    goals: ["Respond without rushing", "Clarify your position", "Handle complexity gracefully"],
    starterPrompts: [
      "You have just finished speaking at a conference and receive a challenging question. Answer it.",
      "Respond in a way that sounds thoughtful, confident, and concise.",
    ],
    followUpPrompts: [
      "How would you respond if the question is partly based on a wrong assumption?",
      "What phrase helps you pause and organize your answer?",
    ],
    culturalNotes: [
      "Public answers often sound stronger when you briefly frame the issue before responding.",
      "It is acceptable to narrow the question if it is too broad or loaded.",
    ],
    voiceSample: "That is an important question, and I would separate it into two parts: the short-term operational view and the longer-term strategic view.",
  },
  {
    id: "formal-advanced-board-update",
    title: "Board Update",
    description: "Deliver a strategic update to a high-level audience.",
    category: "Leadership",
    iconName: "Landmark",
    goals: ["Highlight priorities", "Use strategic language", "Anticipate concerns"],
    starterPrompts: [
      "Give a strategic progress update to a board-level audience.",
      "Explain where progress is strongest, where risk remains, and what decision support you need.",
    ],
    followUpPrompts: [
      "How would you discuss underperformance without sounding defensive?",
      "What evidence makes your update more credible?",
    ],
    culturalNotes: [
      "Board-level communication often sounds sharper when it centers on decisions, not activity alone.",
      "Strategic audiences usually expect tradeoffs, not perfect certainty.",
    ],
    voiceSample: "Our strongest progress is in retention, but the main risk remains execution speed across regional teams.",
  },
  {
    id: "formal-advanced-academic-defense",
    title: "Academic Defense",
    description: "Defend a complex academic point with nuance.",
    category: "Education",
    iconName: "GraduationCap",
    goals: ["Defend a position", "Use careful language", "Balance confidence and precision"],
    starterPrompts: [
      "You are defending a research argument during a formal academic discussion. Respond carefully.",
      "Explain your position, acknowledge a limitation, and reinforce the core argument.",
    ],
    followUpPrompts: [
      "How would you respond to a methodological criticism?",
      "What phrase helps you sound precise rather than defensive?",
    ],
    culturalNotes: [
      "Academic English often sounds strongest when it uses careful qualifiers instead of absolute claims.",
      "Acknowledging limitations can actually strengthen credibility.",
    ],
    voiceSample: "While the dataset has limitations, the central pattern remains consistent across the strongest comparison points.",
  },
  {
    id: "formal-advanced-cross-cultural-meeting",
    title: "Cross-Cultural Meeting",
    description: "Lead a formal conversation with international partners.",
    category: "Leadership",
    iconName: "Plane",
    goals: ["Use clear global English", "Check alignment", "Avoid ambiguity"],
    starterPrompts: [
      "You are leading a formal call with international partners. Open the discussion clearly.",
      "Set the agenda, confirm shared goals, and explain how you want to use the meeting time.",
    ],
    followUpPrompts: [
      "How would you check understanding without sounding patronizing?",
      "What phrases reduce ambiguity in cross-cultural business English?",
    ],
    culturalNotes: [
      "In international meetings, plain English often works better than idioms or humor.",
      "Explicit signposting helps everyone stay aligned.",
    ],
    voiceSample: "To make the meeting useful for everyone, I will start with the objective, then review decisions, and finally confirm the next actions.",
  },
  {
    id: "formal-advanced-legal-brief",
    title: "Policy Briefing",
    description: "Present a careful, high-stakes explanation with precision.",
    category: "Leadership",
    iconName: "ScanSearch",
    goals: ["Use measured language", "Separate fact from interpretation", "Stay concise"],
    starterPrompts: [
      "You need to brief a senior team on a sensitive policy change. Explain it carefully.",
      "State what is confirmed, what is changing, and what remains under review.",
    ],
    followUpPrompts: [
      "How would you answer a question you cannot fully confirm yet?",
      "What wording reduces the risk of overstatement?",
    ],
    culturalNotes: [
      "High-stakes briefings often sound stronger when they avoid certainty beyond the facts.",
      "Phrases like 'based on what we know today' can sound appropriately careful.",
    ],
    voiceSample: "Based on what we know today, the policy change affects reporting timelines more than core service delivery.",
  },
  {
    id: "formal-advanced-partnership-pitch",
    title: "Partnership Proposal",
    description: "Make a persuasive partnership case to another organization.",
    category: "Career",
    iconName: "Store",
    goals: ["Frame mutual value", "Anticipate objections", "Close with a clear ask"],
    starterPrompts: [
      "Present a partnership idea to another organization in a persuasive but professional way.",
      "Explain the value for both sides and suggest a realistic first step.",
    ],
    followUpPrompts: [
      "How would you respond if they want proof before committing?",
      "What language makes the proposal sound collaborative instead of self-serving?",
    ],
    culturalNotes: [
      "Partnership pitches usually sound stronger when they focus on mutual benefit rather than one-sided gain.",
      "A realistic pilot idea can sound more persuasive than an oversized first ask.",
    ],
    voiceSample: "I believe a small pilot partnership would let both teams test value quickly while keeping the commitment practical.",
  },
  {
    id: "formal-advanced-media-response",
    title: "Press Response",
    description: "Answer a formal public question with composure and clarity.",
    category: "Public Speaking",
    iconName: "MessageCircle",
    goals: ["Stay on message", "Avoid overcommitting", "Sound calm and credible"],
    starterPrompts: [
      "A journalist asks about a sensitive issue. Respond carefully and professionally.",
      "Answer in a way that sounds transparent, calm, and responsibly limited to confirmed facts.",
    ],
    followUpPrompts: [
      "How would you handle a repeated question trying to force a stronger claim?",
      "What phrase helps you stay clear without sounding evasive?",
    ],
    culturalNotes: [
      "Public-facing answers often sound better when they return to confirmed facts and current actions.",
      "You can sound transparent without answering beyond what is verified.",
    ],
    voiceSample: "What I can confirm today is that we are reviewing the issue carefully and sharing updates as soon as they are verified.",
  },
];

const casualBeginnerSeeds: ScenarioSeed[] = [
  {
    id: "casual-beginner-friends-catchup",
    title: "Friends Catch-Up",
    description: "Have a relaxed conversation with a friend.",
    category: "Social",
    iconName: "Users",
    goals: ["Share a simple update", "Ask a follow-up question", "Sound warm and natural"],
    starterPrompts: [
      "A friend asks what you have been up to lately. Answer casually.",
      "Share a small life update and ask your friend something back.",
    ],
    followUpPrompts: [
      "What was the best part of your week?",
      "How would you keep the conversation going naturally?",
    ],
    culturalNotes: [
      "Short follow-up questions make casual conversations feel more balanced.",
      "Relaxed English often sounds natural with simple connectors like 'so' or 'then'.",
    ],
    voiceSample: "I have been pretty busy this week, but I finally had time to relax yesterday and catch up with my family.",
  },
  {
    id: "casual-beginner-ordering-food",
    title: "Ordering Food",
    description: "Place a simple order and ask one polite question.",
    category: "Daily Life",
    iconName: "UtensilsCrossed",
    goals: ["Order clearly", "Mention a preference", "Use polite service language"],
    starterPrompts: [
      "You are ordering food at a cafe. Tell the staff what you want.",
      "Place your order and ask one simple question about the menu.",
    ],
    followUpPrompts: [
      "Would you like to change anything about the order?",
      "How would you ask if something is spicy?",
    ],
    culturalNotes: [
      "In casual service settings, 'Could I have...' often sounds polite and natural.",
      "A short confirmation at the end can help avoid mistakes.",
    ],
    voiceSample: "Hi, could I have a vegetable wrap and a small coffee, please? Also, is the sauce spicy?",
  },
  {
    id: "casual-beginner-daily-plans",
    title: "Daily Plans",
    description: "Talk about what you need to do today.",
    category: "Daily Life",
    iconName: "CalendarClock",
    goals: ["Describe plans", "Use time words", "Keep the flow natural"],
    starterPrompts: [
      "Tell me what you need to do today.",
      "Describe your plans for today in a relaxed conversation.",
    ],
    followUpPrompts: [
      "Which part of your day are you looking forward to most?",
      "What might change in your plan?",
    ],
    culturalNotes: [
      "Simple time phrases like 'later this afternoon' or 'after that' help daily plans sound smooth.",
      "Short, natural details make casual speech feel more real.",
    ],
    voiceSample: "This morning I need to finish some work, and later I want to call my cousin and go for a walk.",
  },
  {
    id: "casual-beginner-shopping-help",
    title: "Shopping Help",
    description: "Ask for help while shopping in a friendly way.",
    category: "Daily Life",
    iconName: "ShoppingBag",
    goals: ["Ask for an item", "Mention a need", "Sound polite but casual"],
    starterPrompts: [
      "You are in a store and need help finding something. Ask casually and clearly.",
      "Explain what you are looking for and ask where to find it.",
    ],
    followUpPrompts: [
      "How would you ask whether another size is available?",
      "What would you say if you changed your mind?",
    ],
    culturalNotes: [
      "In stores, short polite questions usually sound more natural than long explanations.",
      "Adding one detail, like size or color, helps the staff respond faster.",
    ],
    voiceSample: "Hi, could you help me find a light jacket? I am looking for something simple and comfortable.",
  },
  {
    id: "casual-beginner-bus-stop",
    title: "Bus Stop Chat",
    description: "Ask a simple question while waiting for transport.",
    category: "Travel",
    iconName: "Bus",
    goals: ["Ask for information", "Sound friendly", "Confirm understanding"],
    starterPrompts: [
      "You are at a bus stop and need information. Ask another passenger politely.",
      "Start a short conversation to confirm which bus you need.",
    ],
    followUpPrompts: [
      "How would you ask if the bus is usually on time?",
      "What would you say to thank the person?",
    ],
    culturalNotes: [
      "Short openers like 'Excuse me' often make casual public questions sound polite.",
      "Repeating key information can help you sound careful and clear.",
    ],
    voiceSample: "Excuse me, does this bus go to Central Station, or should I wait for the next one?",
  },
  {
    id: "casual-beginner-neighbor-intro",
    title: "Neighbor Introduction",
    description: "Introduce yourself naturally to a new neighbor.",
    category: "Social",
    iconName: "Home",
    goals: ["Say hello", "Share a little about yourself", "Sound approachable"],
    starterPrompts: [
      "You meet a new neighbor for the first time. Introduce yourself casually.",
      "Say hello, share a small detail, and ask a friendly question back.",
    ],
    followUpPrompts: [
      "What would you say if you wanted to continue the conversation?",
      "How can you sound friendly without oversharing?",
    ],
    culturalNotes: [
      "Small talk with neighbors often sounds natural when it stays light and friendly.",
      "A short question back can make the exchange feel warm and balanced.",
    ],
    voiceSample: "Hi, I am Riya. I moved in last week, and I am still getting to know the area. How long have you lived here?",
  },
  {
    id: "casual-beginner-coffee-order",
    title: "Coffee Order",
    description: "Customize a drink order clearly.",
    category: "Daily Life",
    iconName: "Coffee",
    goals: ["Order naturally", "Mention preferences", "Confirm details"],
    starterPrompts: [
      "You are ordering a coffee and want to customize it. Speak naturally.",
      "Tell the barista what drink you want and one preference.",
    ],
    followUpPrompts: [
      "How would you ask if oat milk is available?",
      "What would you say if you wanted it less sweet?",
    ],
    culturalNotes: [
      "In cafes, a short order plus one or two preferences usually sounds natural.",
      "Repeating the final order can help confirm accuracy.",
    ],
    voiceSample: "Can I get a medium iced latte with oat milk, please? If possible, I would like it with less sugar.",
  },
  {
    id: "casual-beginner-ticket-counter",
    title: "Ticket Counter",
    description: "Buy a ticket and ask a practical question.",
    category: "Travel",
    iconName: "Ticket",
    goals: ["Ask for a ticket", "State destination", "Confirm timing or price"],
    starterPrompts: [
      "You are buying a ticket at a counter. Explain what you need.",
      "Ask for the ticket and one extra detail, like the time or the price.",
    ],
    followUpPrompts: [
      "How would you ask whether there is a return ticket option?",
      "What would you say if you needed help understanding the schedule?",
    ],
    culturalNotes: [
      "Transport conversations are easier to follow when you say the destination early.",
      "Numbers and times often sound clearer when spoken a little more slowly.",
    ],
    voiceSample: "Hi, I need one ticket to Lakeside, please. What time does the next train leave?",
  },
  {
    id: "casual-beginner-doctor-checkin",
    title: "Clinic Check-In",
    description: "Handle a simple check-in at a clinic or health center.",
    category: "Daily Life",
    iconName: "Stethoscope",
    goals: ["State your name", "Explain your appointment", "Ask a clear next-step question"],
    starterPrompts: [
      "You have arrived for an appointment at a clinic. Check in clearly.",
      "Introduce yourself at the desk and confirm what you should do next.",
    ],
    followUpPrompts: [
      "How would you ask how long the wait might be?",
      "What detail would help the receptionist find your booking?",
    ],
    culturalNotes: [
      "Simple, calm language usually works best in check-in conversations.",
      "Mentioning your appointment time can make the conversation smoother.",
    ],
    voiceSample: "Hello, I am here for my appointment with Dr. Shah at two o'clock. Should I wait here or fill out a form first?",
  },
  {
    id: "casual-beginner-weekend-plan",
    title: "Weekend Plans",
    description: "Talk casually about your weekend with a friend.",
    category: "Social",
    iconName: "PartyPopper",
    goals: ["Share plans", "Express feeling", "Ask about the other person"],
    starterPrompts: [
      "A friend asks about your weekend plans. Answer casually.",
      "Talk about what you might do this weekend and ask your friend the same question.",
    ],
    followUpPrompts: [
      "What sounds most fun about your plan?",
      "How would you mention that your plan is still flexible?",
    ],
    culturalNotes: [
      "Weekend conversations often sound natural when you leave room for uncertainty, like 'I might' or 'I am thinking about'.",
      "A relaxed follow-up question helps keep the chat going.",
    ],
    voiceSample: "I might meet a friend on Saturday and stay home on Sunday to rest a little. What about you?",
  },
];

const casualIntermediateSeeds: ScenarioSeed[] = [
  {
    id: "casual-intermediate-roommate-discussion",
    title: "Roommate Discussion",
    description: "Talk through a shared-living issue without sounding harsh.",
    category: "Social",
    iconName: "Home",
    goals: ["Raise a concern politely", "Explain your point", "Suggest a solution"],
    starterPrompts: [
      "You need to talk to your roommate about a small problem at home. Start the conversation.",
      "Explain the issue and suggest a practical fix without sounding rude.",
    ],
    followUpPrompts: [
      "How would you respond if they disagree?",
      "What phrase helps you sound calm and collaborative?",
    ],
    culturalNotes: [
      "In casual conflict, 'I noticed...' can sound softer than direct blame.",
      "A suggested solution often makes the conversation feel more constructive.",
    ],
    voiceSample: "I wanted to bring up something small about the kitchen because I think we could make it easier for both of us to keep it organized.",
  },
  {
    id: "casual-intermediate-travel-delay",
    title: "Travel Delay",
    description: "Handle an informal but slightly stressful travel conversation.",
    category: "Travel",
    iconName: "Plane",
    goals: ["Explain the situation", "Ask for help clearly", "Stay calm under pressure"],
    starterPrompts: [
      "Your travel plans changed unexpectedly. Explain the situation and ask for help.",
      "Tell someone at the counter about the delay and what you need now.",
    ],
    followUpPrompts: [
      "How would you ask about alternate options?",
      "What detail should you share first to save time?",
    ],
    culturalNotes: [
      "Travel staff conversations often go more smoothly when you state the problem first, then the request.",
      "Short, clear questions are helpful in busy travel environments.",
    ],
    voiceSample: "My train was cancelled, and I am trying to find the fastest way to get to the airport this evening.",
  },
  {
    id: "casual-intermediate-online-order",
    title: "Order Problem",
    description: "Explain a delivery issue in clear everyday English.",
    category: "Daily Life",
    iconName: "ShoppingCart",
    goals: ["Describe the problem", "Request a reasonable fix", "Stay polite but firm"],
    starterPrompts: [
      "Your online order arrived with a problem. Explain it clearly.",
      "Tell customer support what happened and what resolution you want.",
    ],
    followUpPrompts: [
      "How would you sound firm without sounding angry?",
      "What detail would make your request easier to resolve?",
    ],
    culturalNotes: [
      "Customer support conversations often sound strongest when they stay specific and solution-focused.",
      "Briefly naming your preferred outcome can save time.",
    ],
    voiceSample: "The order arrived on time, but one item was missing, so I would like to know whether you can resend it or refund it.",
  },
  {
    id: "casual-intermediate-gym-chat",
    title: "Gym Conversation",
    description: "Have a practical conversation at the gym.",
    category: "Daily Life",
    iconName: "ShieldCheck",
    goals: ["Ask a question naturally", "Explain a goal", "Keep the exchange friendly"],
    starterPrompts: [
      "You are talking to a trainer or gym staff member. Explain what help you need.",
      "Describe your fitness goal and ask one useful question.",
    ],
    followUpPrompts: [
      "How would you ask whether an exercise is suitable for beginners?",
      "What extra detail could help the trainer guide you better?",
    ],
    culturalNotes: [
      "Casual fitness conversations often sound natural when they stay practical and specific.",
      "A direct but friendly question works well in this setting.",
    ],
    voiceSample: "I want to build a more regular routine, but I am not sure which exercises would be best for improving stamina first.",
  },
  {
    id: "casual-intermediate-family-call",
    title: "Family Call",
    description: "Share a meaningful life update with a family member.",
    category: "Social",
    iconName: "Phone",
    goals: ["Share news clearly", "Express emotion naturally", "Keep a warm tone"],
    starterPrompts: [
      "You are calling a family member to share an update. Start the conversation.",
      "Tell them what changed recently and how you feel about it.",
    ],
    followUpPrompts: [
      "How would you explain a mixed emotion, like feeling excited and nervous?",
      "What question would you ask them in return?",
    ],
    culturalNotes: [
      "Family conversations often sound natural when emotion and detail are balanced.",
      "A reflective sentence can make the update feel more genuine.",
    ],
    voiceSample: "I wanted to call because something important changed at work, and I feel excited about it, but also a little nervous about what comes next.",
  },
  {
    id: "casual-intermediate-social-invite",
    title: "Invite a Friend",
    description: "Invite someone out and handle uncertainty smoothly.",
    category: "Social",
    iconName: "PartyPopper",
    goals: ["Make a clear invitation", "Suggest details", "Respond flexibly"],
    starterPrompts: [
      "Invite a friend to do something this week in a natural way.",
      "Suggest a plan, give a reason, and leave room if they are busy.",
    ],
    followUpPrompts: [
      "How would you respond if they cannot come?",
      "What phrase helps the invitation sound relaxed rather than pushy?",
    ],
    culturalNotes: [
      "Casual invitations often sound more natural when they feel flexible rather than demanding.",
      "A simple reason can make the invitation feel warmer and more personal.",
    ],
    voiceSample: "I was thinking of checking out that new cafe on Friday evening if you are free. It looks like a nice place to relax and catch up.",
  },
  {
    id: "casual-intermediate-return-item",
    title: "Return an Item",
    description: "Explain a return request with clear everyday language.",
    category: "Daily Life",
    iconName: "ShoppingBag",
    goals: ["State the problem", "Explain the reason", "Ask what options are available"],
    starterPrompts: [
      "You want to return an item to a store. Explain why and ask what to do next.",
      "Describe the issue and ask whether a refund or exchange is possible.",
    ],
    followUpPrompts: [
      "How would you respond if they ask whether you kept the receipt?",
      "What phrasing sounds polite but confident here?",
    ],
    culturalNotes: [
      "Return conversations often sound clearer when the reason is specific and simple.",
      "A calm tone usually works better than a frustrated tone with service staff.",
    ],
    voiceSample: "I bought this yesterday, but it does not fit the way I expected, so I wanted to ask whether I could exchange it for another size.",
  },
  {
    id: "casual-intermediate-small-talk",
    title: "Extended Small Talk",
    description: "Keep a casual conversation going with more depth.",
    category: "Social",
    iconName: "MessageCircle",
    goals: ["Extend the conversation", "Show interest", "Use natural transitions"],
    starterPrompts: [
      "You are chatting with someone new at a social event. Start and continue the conversation.",
      "Introduce yourself casually and ask questions that keep the conversation moving.",
    ],
    followUpPrompts: [
      "How would you move from basic introductions to a more interesting topic?",
      "What phrase helps you sound curious without sounding formal?",
    ],
    culturalNotes: [
      "Good small talk often depends more on follow-up questions than clever first lines.",
      "Reacting naturally to what the other person says makes the exchange feel more alive.",
    ],
    voiceSample: "I just moved here a few months ago, so I am still discovering good places around the city. Do you have any favorites?",
  },
  {
    id: "casual-intermediate-station-help",
    title: "Station Assistance",
    description: "Ask for practical travel help in a busy setting.",
    category: "Travel",
    iconName: "TrainFront",
    goals: ["Describe your need efficiently", "Ask a focused question", "Confirm next steps"],
    starterPrompts: [
      "You need help at a station because you are unsure about your route. Ask clearly.",
      "Explain where you are going and what information you need right now.",
    ],
    followUpPrompts: [
      "How would you ask whether you need to change platforms?",
      "What phrase helps you confirm the direction correctly?",
    ],
    culturalNotes: [
      "Busy public settings often reward short, efficient questions.",
      "Repeating the destination name can help avoid mistakes.",
    ],
    voiceSample: "I am trying to get to Riverside Park, but I am not sure whether this train stops there or if I need to switch lines first.",
  },
  {
    id: "casual-intermediate-group-plan",
    title: "Group Plan",
    description: "Coordinate plans with several friends smoothly.",
    category: "Social",
    iconName: "Users",
    goals: ["Suggest a plan", "Balance preferences", "Keep the tone easygoing"],
    starterPrompts: [
      "You are helping friends decide on a group plan. Start the conversation.",
      "Suggest an option, mention why it could work, and invite other ideas.",
    ],
    followUpPrompts: [
      "How would you respond if everyone wants something different?",
      "What phrase helps you sound flexible instead of controlling?",
    ],
    culturalNotes: [
      "Group planning often sounds more natural when you propose an idea and invite input right away.",
      "Flexible language like 'we could' helps keep the mood collaborative.",
    ],
    voiceSample: "We could meet a little earlier, grab dinner nearby, and then decide together whether we want to see a movie or just walk around.",
  },
];

const casualAdvancedSeeds: ScenarioSeed[] = [
  {
    id: "casual-advanced-difficult-friend-talk",
    title: "Difficult Friend Talk",
    description: "Handle a sensitive personal conversation with honesty and care.",
    category: "Relationships",
    iconName: "HeartHandshake",
    goals: ["Express feelings clearly", "Stay respectful", "Navigate emotional nuance"],
    starterPrompts: [
      "You need to talk to a friend about something sensitive. Start the conversation thoughtfully.",
      "Explain how you feel, why it matters, and what you hope for next.",
    ],
    followUpPrompts: [
      "How would you respond if your friend becomes defensive?",
      "What phrasing sounds honest without sounding accusatory?",
    ],
    culturalNotes: [
      "Sensitive conversations often feel safer when you speak from your own experience rather than making accusations.",
      "Pausing to acknowledge the relationship can soften a hard message.",
    ],
    voiceSample: "I wanted to bring this up because our friendship matters to me, and I do not want a misunderstanding to keep growing between us.",
  },
  {
    id: "casual-advanced-travel-story",
    title: "Travel Story",
    description: "Tell a vivid story from a trip with natural flow.",
    category: "Storytelling",
    iconName: "Plane",
    goals: ["Tell a story smoothly", "Build detail and pacing", "Sound expressive and natural"],
    starterPrompts: [
      "Tell a memorable story from a trip in a lively, natural way.",
      "Share what happened, why it stood out, and how you felt about it afterward.",
    ],
    followUpPrompts: [
      "How would you make the story more vivid without overexplaining?",
      "What transition helps the story move from setup to the main moment?",
    ],
    culturalNotes: [
      "Strong storytelling often depends on pacing and selective detail, not just more words.",
      "A reflective ending can make a casual story feel more memorable.",
    ],
    voiceSample: "At first it looked like a simple delay, but within an hour the whole station felt like a puzzle and everyone was trying to improvise a new plan.",
  },
  {
    id: "casual-advanced-opinion-discussion",
    title: "Opinion Discussion",
    description: "Express a nuanced opinion without sounding aggressive.",
    category: "Discussion",
    iconName: "MessageCircle",
    goals: ["State your view clearly", "Add nuance", "Invite real conversation"],
    starterPrompts: [
      "You are discussing an opinion with friends. Share your view in a thoughtful way.",
      "Explain what you think, why you think it, and where you still see complexity.",
    ],
    followUpPrompts: [
      "How would you disagree without sounding dismissive?",
      "What phrase helps you acknowledge another perspective while keeping your own?",
    ],
    culturalNotes: [
      "Nuanced casual discussion often sounds better with phrases like 'I can see why people think that, but...'.",
      "Complex opinions usually sound stronger when they leave room for uncertainty.",
    ],
    voiceSample: "I get why that perspective is popular, but I think the real issue is more complicated once you look at how people are affected differently.",
  },
  {
    id: "casual-advanced-housemate-boundary",
    title: "Boundary Setting",
    description: "Set a personal boundary kindly but firmly.",
    category: "Relationships",
    iconName: "Home",
    goals: ["Be direct", "Stay calm", "Protect the relationship while setting limits"],
    starterPrompts: [
      "You need to set a boundary with someone you live with. Start that conversation carefully.",
      "Explain what needs to change and why it matters to you, without sounding harsh.",
    ],
    followUpPrompts: [
      "How would you respond if they say you are overreacting?",
      "What wording makes the boundary sound clear and reasonable?",
    ],
    culturalNotes: [
      "Boundaries often sound stronger when they are specific and calm.",
      "It can help to explain the impact on you instead of judging the other person.",
    ],
    voiceSample: "I want us to live together comfortably, so I need to be honest that I really need more quiet time late at night to rest properly.",
  },
  {
    id: "casual-advanced-group-disagreement",
    title: "Group Disagreement",
    description: "Navigate disagreement in a group without escalating tension.",
    category: "Discussion",
    iconName: "Users",
    goals: ["Disagree tactfully", "Keep the discussion constructive", "Balance confidence and openness"],
    starterPrompts: [
      "You disagree with a group plan, but you want to keep the mood positive. Speak up.",
      "Explain your concern and suggest an alternative without shutting people down.",
    ],
    followUpPrompts: [
      "How would you respond if the group still prefers the original idea?",
      "What phrase helps your disagreement sound constructive instead of negative?",
    ],
    culturalNotes: [
      "A constructive disagreement often starts by recognizing what others are trying to achieve.",
      "Alternatives usually land better than criticism alone.",
    ],
    voiceSample: "I see why that option sounds fun, but I am not sure it works for everyone's budget, so maybe we could look at something a bit more flexible.",
  },
  {
    id: "casual-advanced-service-recovery",
    title: "Service Recovery",
    description: "Explain a frustrating service issue with poise and detail.",
    category: "Daily Life",
    iconName: "Store",
    goals: ["Describe frustration clearly", "Stay composed", "Ask for a fair resolution"],
    starterPrompts: [
      "You have had a frustrating experience with a service provider. Explain it clearly.",
      "Describe what happened, why it was disappointing, and what outcome you want now.",
    ],
    followUpPrompts: [
      "How would you sound firm without sounding insulting?",
      "What details make your explanation more persuasive?",
    ],
    culturalNotes: [
      "Composed complaints often sound more credible than emotional ones.",
      "A clear request at the end gives the conversation direction.",
    ],
    voiceSample: "I am not upset about one small mistake on its own, but the repeated delays and inconsistent updates made the experience much more frustrating than it needed to be.",
  },
  {
    id: "casual-advanced-life-update",
    title: "Big Life Update",
    description: "Share a meaningful personal update with emotional depth.",
    category: "Storytelling",
    iconName: "UserPlus",
    goals: ["Tell the update clearly", "Reflect on emotion", "Sound sincere and grounded"],
    starterPrompts: [
      "Share a major personal update with a close friend in a natural, thoughtful way.",
      "Explain what changed, how you feel about it, and what you are still figuring out.",
    ],
    followUpPrompts: [
      "How would you describe feeling both excited and uncertain at the same time?",
      "What detail would make the update feel more personal and real?",
    ],
    culturalNotes: [
      "Big personal updates often feel more authentic when they include both facts and reflection.",
      "A little uncertainty can make the story sound more human and relatable.",
    ],
    voiceSample: "It still feels a little unreal, but I finally decided to make the move, and now I am trying to balance the excitement with all the practical things I need to sort out.",
  },
  {
    id: "casual-advanced-community-event",
    title: "Community Event",
    description: "Speak naturally while organizing or joining a local event.",
    category: "Social",
    iconName: "PartyPopper",
    goals: ["Coordinate clearly", "Motivate others", "Keep the tone warm and inclusive"],
    starterPrompts: [
      "You are helping organize a community event. Explain the plan in a friendly way.",
      "Share the idea, invite people in, and explain how they can take part.",
    ],
    followUpPrompts: [
      "How would you encourage someone who feels unsure about joining?",
      "What phrasing helps the invitation feel open and welcoming?",
    ],
    culturalNotes: [
      "Inclusive language like 'we would love to have you' can help people feel more comfortable joining.",
      "Warm, practical details often make invitations feel more real.",
    ],
    voiceSample: "We are keeping it simple and welcoming, so people can join for a little while, meet new neighbors, and take part however they feel comfortable.",
  },
  {
    id: "casual-advanced-train-debate",
    title: "Travel Decision",
    description: "Talk through a fast-changing travel choice with nuance.",
    category: "Travel",
    iconName: "TrainFront",
    goals: ["Compare options", "Explain tradeoffs", "Sound decisive without rushing"],
    starterPrompts: [
      "You and a friend need to decide quickly how to continue a trip. Talk through the options.",
      "Compare the choices, explain the tradeoffs, and suggest what you think makes the most sense.",
    ],
    followUpPrompts: [
      "How would you respond if your friend values cost more than convenience?",
      "What phrase helps you sound flexible while still making a recommendation?",
    ],
    culturalNotes: [
      "Comparing tradeoffs clearly can make casual decision-making sound more confident.",
      "Phrases like 'the main difference is...' help organize the comparison.",
    ],
    voiceSample: "The cheaper option probably works if we do not mind arriving late, but if timing matters more, I think the direct route is worth the extra cost.",
  },
  {
    id: "casual-advanced-cafe-recommendation",
    title: "Recommendation Chat",
    description: "Give a rich, natural recommendation in conversation.",
    category: "Storytelling",
    iconName: "Coffee",
    goals: ["Recommend clearly", "Explain why", "Sound expressive rather than scripted"],
    starterPrompts: [
      "A friend asks for a recommendation. Share it in a natural, detailed way.",
      "Explain what you recommend, why you like it, and who it would suit best.",
    ],
    followUpPrompts: [
      "How would you make the recommendation sound vivid and specific?",
      "What phrase helps you sound enthusiastic without exaggerating?",
    ],
    culturalNotes: [
      "Good recommendations usually sound more convincing when they include concrete details.",
      "A little contrast, like 'if you want X rather than Y', can make the recommendation more helpful.",
    ],
    voiceSample: "What I like about that place is not just the food itself, but the atmosphere, because it feels relaxed enough to stay for a long conversation without being noisy.",
  },
];

function toDifficulty(level: Level): Difficulty {
  if (level === "beginner") return "Beginner";
  if (level === "intermediate") return "Intermediate";
  return "Advanced";
}

function buildScenarios(mode: Mode, level: Level, seeds: ScenarioSeed[]): ScenarioWithIcon[] {
  return seeds.map((seed) => ({
    ...seed,
    mode,
    level,
    difficulty: toDifficulty(level),
    Icon: iconMap[seed.iconName],
  }));
}

export const scenarios: ScenarioWithIcon[] = [
  ...buildScenarios("formal", "beginner", formalBeginnerSeeds),
  ...buildScenarios("formal", "intermediate", formalIntermediateSeeds),
  ...buildScenarios("formal", "advanced", formalAdvancedSeeds),
  ...buildScenarios("casual", "beginner", casualBeginnerSeeds),
  ...buildScenarios("casual", "intermediate", casualIntermediateSeeds),
  ...buildScenarios("casual", "advanced", casualAdvancedSeeds),
];

export const pronunciationExercises: PronunciationExercise[] = [
  {
    id: "pron-beginner-clear-r",
    title: "Warm River",
    type: "minimal-pair",
    level: "beginner",
    focus: "R and L distinction",
    prompt: "Repeat: really, rarely, river, library, light, right.",
    targetWords: ["really", "rarely", "river", "library", "light", "right"],
    coachNote: "Slow down on the first sound and exaggerate the tongue placement slightly.",
  },
  {
    id: "pron-beginner-soft-th",
    title: "Thankful Thursday",
    type: "tongue-twister",
    level: "beginner",
    focus: "Soft th sound",
    prompt: "Repeat: Three thoughtful thinkers thanked Theo on Thursday.",
    targetWords: ["three", "thoughtful", "thinkers", "thanked", "Theo", "Thursday"],
    coachNote: "Let the tongue come slightly forward for the th sound instead of using a hard t.",
  },
  {
    id: "pron-beginner-steady-sentence",
    title: "Daily Fluency Line",
    type: "fluency-line",
    level: "beginner",
    focus: "Steady rhythm",
    prompt: "Say: I can speak clearly when I slow down and finish each idea.",
    targetWords: ["speak", "clearly", "slow", "finish", "idea"],
    coachNote: "Pause slightly before the final phrase so the sentence ends with confidence.",
  },
  {
    id: "pron-intermediate-vowel-contrast",
    title: "Ship and Sheep",
    type: "minimal-pair",
    level: "intermediate",
    focus: "Short and long i vowel",
    prompt: "Repeat: ship, sheep, live, leave, fill, feel.",
    targetWords: ["ship", "sheep", "live", "leave", "fill", "feel"],
    coachNote: "Keep the short vowel quick and the long vowel slightly longer and brighter.",
  },
  {
    id: "pron-intermediate-paced-twist",
    title: "Silver Service",
    type: "tongue-twister",
    level: "intermediate",
    focus: "S and sh clarity",
    prompt: "Repeat: She sells smart silver service sets slowly.",
    targetWords: ["she", "sells", "smart", "silver", "service", "sets", "slowly"],
    coachNote: "Do not rush the s and sh contrast; accuracy matters more than speed first.",
  },
  {
    id: "pron-intermediate-confident-line",
    title: "Presentation Rhythm",
    type: "fluency-line",
    level: "intermediate",
    focus: "Sentence stress",
    prompt: "Say: Today I want to explain the main idea clearly and confidently.",
    targetWords: ["today", "explain", "main idea", "clearly", "confidently"],
    coachNote: "Stress the content words and let the smaller words stay lighter.",
  },
  {
    id: "pron-advanced-linked-speech",
    title: "Linked Thought",
    type: "fluency-line",
    level: "advanced",
    focus: "Linking and natural flow",
    prompt: "Say: If I look at it another way, the challenge becomes an opportunity to simplify.",
    targetWords: ["look at it", "another way", "challenge", "opportunity", "simplify"],
    coachNote: "Link the small words smoothly so the sentence sounds connected, not choppy.",
  },
  {
    id: "pron-advanced-precise-vowels",
    title: "Career Clarity",
    type: "minimal-pair",
    level: "advanced",
    focus: "Schwa and stressed vowels",
    prompt: "Repeat: analysis, develop, support, focus, strategic, deliver.",
    targetWords: ["analysis", "develop", "support", "focus", "strategic", "deliver"],
    coachNote: "Notice which syllables are reduced and which ones carry the stress.",
  },
  {
    id: "pron-advanced-fast-clarity",
    title: "Crisp Leadership",
    type: "tongue-twister",
    level: "advanced",
    focus: "Consonant precision at speed",
    prompt: "Repeat: Clear, credible leaders calmly close complex conversations.",
    targetWords: ["clear", "credible", "leaders", "calmly", "close", "complex", "conversations"],
    coachNote: "Keep each starting consonant crisp, especially once you begin to speed up.",
  },
];

export const modeCards: Array<{ id: Mode; title: string; examples: string; Icon: typeof Briefcase }> = [
  { id: "formal", title: "Formal", examples: "Interviews, presentations, client calls, workplace meetings", Icon: Briefcase },
  { id: "casual", title: "Casual", examples: "Friends, travel, shopping, everyday conversations", Icon: Coffee },
];

export const difficultyColor: Record<Difficulty, string> = {
  Beginner: "bg-success/15 text-success border-success/30",
  Intermediate: "bg-accent-secondary/15 text-blue-300 border-accent-secondary/30",
  Advanced: "bg-purple-500/15 text-purple-300 border-purple-400/30",
};

export const levelCopy: Record<Level, string> = {
  beginner: "You are ready to build clear everyday sentences with patient practice.",
  intermediate: "You can express ideas well and are ready to polish tone and structure.",
  advanced: "You are ready for nuanced expression, stronger vocabulary, and confident delivery.",
};

export function getScenario(id?: string | null) {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}

export function getScenariosForTrack(mode: Mode, level: Level) {
  return scenarios.filter((scenario) => scenario.mode === mode && scenario.level === level);
}

export function getSuggestedScenarioIds(level: Level): string[] {
  const choices: Record<Level, string[]> = {
    beginner: ["formal-beginner-meeting-update", "casual-beginner-friends-catchup", "casual-beginner-ordering-food"],
    intermediate: ["formal-intermediate-panel-interview", "casual-intermediate-small-talk", "formal-intermediate-client-call"],
    advanced: ["formal-advanced-executive-presentation", "casual-advanced-opinion-discussion", "formal-advanced-cross-cultural-meeting"],
  };
  return choices[level];
}

export function getScenarioOpening(scenario: Scenario, attempt = 0) {
  const prompts = attempt > 0 ? scenario.followUpPrompts : scenario.starterPrompts;
  return prompts[attempt % prompts.length];
}

export function getScenarioCulturalNote(scenario: Scenario, attempt = 0) {
  return scenario.culturalNotes[attempt % scenario.culturalNotes.length];
}

export function getPronunciationExercise(id?: string | null) {
  return pronunciationExercises.find((exercise) => exercise.id === id) ?? pronunciationExercises[0];
}

export function getPronunciationExercisesForLevel(level: Level) {
  return pronunciationExercises.filter((exercise) => exercise.level === level);
}

export function levelFromScore(total: number): Level {
  if (total <= 3) return "beginner";
  if (total <= 6) return "intermediate";
  return "advanced";
}

export function scoreText(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const total = words.length;
  if (total < 5) return 0;

  const uniqueRatio = new Set(words.map((word) => word.toLowerCase())).size / total;
  if (uniqueRatio < 0.3) return 0;

  const lengthScore = total > 20 ? 1.0 : total > 10 ? 0.5 : 0.0;
  const varietyScore = uniqueRatio > 0.7 ? 1.0 : uniqueRatio > 0.4 ? 0.5 : 0.0;
  return Math.round(lengthScore + varietyScore);
}

export function scoreAssessment(answers: AssessmentAnswer[]) {
  const byId = new Map(answers.map((answer) => [answer.questionId, answer.value]));
  const grammar = byId.get("grammar") === assessmentQuestions[0].correct ? 2 : 0;
  const vocabulary = byId.get("vocabulary") === assessmentQuestions[1].correct ? 2 : 0;
  const fluency = scoreText(byId.get("fluency") ?? "");
  const pronunciationValue = byId.get("pronunciation");
  const pronunciation = pronunciationValue === "Very confident" ? 2 : pronunciationValue === "Somewhat" ? 1 : 0;
  const composition = scoreText(byId.get("composition") ?? "");
  const total = grammar + vocabulary + fluency + pronunciation + composition;
  return {
    level: levelFromScore(total),
    scores: { grammar, vocabulary, fluency, pronunciation, composition, total },
  };
}
