// STEP 13: /src/data/scenarios.ts
// 60 structured practice scenarios for Fluvi.
// NOTE: This Scenario interface is local to Fluvi and is different from
// the extended Scenario in src/types/index.ts (which includes goals, starterPrompts, etc.)
// Import from this file specifically for scenario selection UI.

export interface FluviScenario {
  id: string;
  title: string;
  description: string;
  mode: 'formal' | 'casual';
  level: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  openingPrompt: string;
  tags: string[];
}

export const SCENARIOS: FluviScenario[] = [
  // ── FORMAL → BEGINNER ──
  {
    id: 'f-b-01', title: 'Introducing Yourself to a Teacher',
    description: 'Practice a polite, clear self-introduction in a classroom setting.',
    mode: 'formal', level: 'beginner', icon: '👋',
    openingPrompt: "Good morning! I'm your new English teacher. Could you please introduce yourself to the class?",
    tags: ['introduction', 'classroom'],
  },
  {
    id: 'f-b-02', title: 'Asking Permission to Enter a Class',
    description: 'Learn how to politely request entry when you arrive late.',
    mode: 'formal', level: 'beginner', icon: '🚪',
    openingPrompt: "You've arrived five minutes late to class. The teacher looks up at you. What do you say?",
    tags: ['permission', 'politeness'],
  },
  {
    id: 'f-b-03', title: 'Requesting Help with Homework',
    description: 'Ask your teacher clearly and politely for homework assistance.',
    mode: 'formal', level: 'beginner', icon: '📚',
    openingPrompt: "Your teacher is at their desk after class. You need help with your homework. How do you ask?",
    tags: ['homework', 'asking-for-help'],
  },
  {
    id: 'f-b-04', title: 'Greeting a Staff Member Politely',
    description: 'Practice a respectful greeting with a school staff member.',
    mode: 'formal', level: 'beginner', icon: '🤝',
    openingPrompt: "You see the school principal in the hallway. What do you say?",
    tags: ['greeting', 'respect'],
  },
  {
    id: 'f-b-05', title: 'Asking a Simple Question in Class',
    description: 'Ask a clarifying question to your teacher during a lesson.',
    mode: 'formal', level: 'beginner', icon: '🙋',
    openingPrompt: "Your teacher has just explained a topic but you didn't quite understand. How do you ask for clarification?",
    tags: ['questions', 'classroom'],
  },
  {
    id: 'f-b-06', title: 'Thanking a Teacher',
    description: 'Express genuine gratitude to your teacher after receiving help.',
    mode: 'formal', level: 'beginner', icon: '🙏',
    openingPrompt: "Your teacher just spent extra time helping you understand a difficult concept. What do you say?",
    tags: ['gratitude', 'politeness'],
  },
  {
    id: 'f-b-07', title: 'Asking for Directions in School',
    description: 'Ask a school staff member how to find a location politely.',
    mode: 'formal', level: 'beginner', icon: '🗺️',
    openingPrompt: "You're new to the school and need to find the library. You see a staff member. How do you ask?",
    tags: ['directions', 'navigation'],
  },
  {
    id: 'f-b-08', title: 'Speaking During Attendance',
    description: 'Respond appropriately when your name is called during roll call.',
    mode: 'formal', level: 'beginner', icon: '📋',
    openingPrompt: "The teacher is calling attendance. When your name is called, what do you say and how do you say it?",
    tags: ['attendance', 'classroom'],
  },
  {
    id: 'f-b-09', title: 'Giving a Short Introduction in Class',
    description: 'Deliver a brief, confident introduction in front of your classmates.',
    mode: 'formal', level: 'beginner', icon: '📢',
    openingPrompt: "Your teacher asks you to stand up and tell the class three things about yourself. Go ahead!",
    tags: ['introduction', 'public-speaking'],
  },
  {
    id: 'f-b-10', title: 'Asking for Clarification Politely',
    description: 'Ask a teacher to repeat or explain something more clearly.',
    mode: 'formal', level: 'beginner', icon: '❓',
    openingPrompt: "The teacher explained the homework but you're not sure what to do. How do you ask them to clarify?",
    tags: ['clarification', 'communication'],
  },

  // ── FORMAL → INTERMEDIATE ──
  {
    id: 'f-i-01', title: 'Attending a Job Interview',
    description: 'Practice confident, professional responses in a job interview setting.',
    mode: 'formal', level: 'intermediate', icon: '💼',
    openingPrompt: "Good morning! Please take a seat. Can you start by telling me about yourself and why you're interested in this position?",
    tags: ['interview', 'career'],
  },
  {
    id: 'f-i-02', title: 'Giving a Classroom Presentation',
    description: 'Deliver a short structured presentation on a topic to your class.',
    mode: 'formal', level: 'intermediate', icon: '🎤',
    openingPrompt: "You have 2 minutes to present on your chosen topic. The class is ready. Please begin your presentation.",
    tags: ['presentation', 'public-speaking'],
  },
  {
    id: 'f-i-03', title: 'Explaining a Simple Concept',
    description: 'Describe how something works in clear, organized English.',
    mode: 'formal', level: 'intermediate', icon: '💡',
    openingPrompt: "Can you explain how the water cycle works to someone who has never heard of it before?",
    tags: ['explanation', 'clarity'],
  },
  {
    id: 'f-i-04', title: 'Participating in a Group Discussion',
    description: 'Add your point of view politely during a structured class discussion.',
    mode: 'formal', level: 'intermediate', icon: '🗣️',
    openingPrompt: "The class is discussing whether students should be allowed to use mobile phones in school. What is your position and why?",
    tags: ['discussion', 'opinion'],
  },
  {
    id: 'f-i-05', title: 'Writing or Speaking a Formal Request',
    description: 'Make a formal request using appropriate language and structure.',
    mode: 'formal', level: 'intermediate', icon: '📝',
    openingPrompt: "You need to ask your school to provide extra study materials for an upcoming exam. How do you make this request formally?",
    tags: ['request', 'formal-language'],
  },
  {
    id: 'f-i-06', title: 'Describing Your Skills',
    description: 'Articulate your strengths and abilities in a professional context.',
    mode: 'formal', level: 'intermediate', icon: '⭐',
    openingPrompt: "An interviewer asks: 'What are your strongest skills and how have you used them?' Please respond.",
    tags: ['skills', 'self-presentation'],
  },
  {
    id: 'f-i-07', title: 'Asking for Detailed Information',
    description: 'Request specific information politely and clearly.',
    mode: 'formal', level: 'intermediate', icon: '🔍',
    openingPrompt: "You're calling a university to ask about their application process. How do you begin the conversation and ask your questions?",
    tags: ['information', 'formal-inquiry'],
  },
  {
    id: 'f-i-08', title: 'Giving Instructions to Someone',
    description: 'Explain a process step-by-step to someone who is new.',
    mode: 'formal', level: 'intermediate', icon: '📌',
    openingPrompt: "A new student has joined your class. Your teacher asks you to explain the school's daily schedule to them.",
    tags: ['instructions', 'clarity'],
  },
  {
    id: 'f-i-09', title: 'Reporting an Issue Politely',
    description: 'Bring up a problem to an authority figure in a respectful manner.',
    mode: 'formal', level: 'intermediate', icon: '⚠️',
    openingPrompt: "There's a broken desk in your classroom affecting students. How do you report this to your teacher or school office?",
    tags: ['reporting', 'problem-solving'],
  },
  {
    id: 'f-i-10', title: 'Answering Structured Questions',
    description: 'Provide well-organized, complete answers to formal questions.',
    mode: 'formal', level: 'intermediate', icon: '🎯',
    openingPrompt: "An interviewer asks: 'Describe a challenge you have faced and how you overcame it.'",
    tags: ['structured-response', 'interview'],
  },

  // ── FORMAL → ADVANCED ──
  {
    id: 'f-a-01', title: 'Handling a Professional Meeting',
    description: 'Lead or contribute meaningfully to a formal business meeting.',
    mode: 'formal', level: 'advanced', icon: '🏢',
    openingPrompt: "You're in a quarterly review meeting. Your manager asks you to summarize your team's performance this quarter. Please go ahead.",
    tags: ['meeting', 'leadership'],
  },
  {
    id: 'f-a-02', title: 'Delivering a Formal Speech',
    description: 'Deliver a structured, persuasive speech on a meaningful topic.',
    mode: 'formal', level: 'advanced', icon: '🎙️',
    openingPrompt: "You've been asked to give a 3-minute speech on the importance of digital literacy. Please begin.",
    tags: ['speech', 'persuasion'],
  },
  {
    id: 'f-a-03', title: 'Negotiating in a Formal Setting',
    description: 'Practice negotiation tactics using formal, professional language.',
    mode: 'formal', level: 'advanced', icon: '🤝',
    openingPrompt: "You're negotiating a project deadline extension with your client who is unhappy about delays. How do you approach this?",
    tags: ['negotiation', 'professional'],
  },
  {
    id: 'f-a-04', title: 'Handling a Complaint Professionally',
    description: 'Address a customer or colleague complaint with empathy and clarity.',
    mode: 'formal', level: 'advanced', icon: '🛡️',
    openingPrompt: "A customer says: 'I've been waiting three weeks for my order and nobody has responded to my emails. This is unacceptable.' How do you respond?",
    tags: ['complaints', 'customer-service'],
  },
  {
    id: 'f-a-05', title: 'Expressing Disagreement Politely',
    description: 'Disagree with a proposal professionally without causing conflict.',
    mode: 'formal', level: 'advanced', icon: '⚖️',
    openingPrompt: "In a meeting, your manager proposes a strategy you believe will not work. How do you express your disagreement respectfully?",
    tags: ['disagreement', 'diplomacy'],
  },
  {
    id: 'f-a-06', title: 'Leading a Team Discussion',
    description: 'Facilitate a team conversation and guide it toward a productive outcome.',
    mode: 'formal', level: 'advanced', icon: '👥',
    openingPrompt: "You're facilitating a team meeting to decide how to handle an upcoming product launch delay. How do you open and run the discussion?",
    tags: ['leadership', 'facilitation'],
  },
  {
    id: 'f-a-07', title: 'Explaining a Complex Idea',
    description: 'Break down a complex concept clearly for a non-expert audience.',
    mode: 'formal', level: 'advanced', icon: '🔬',
    openingPrompt: "Explain the concept of artificial intelligence to a group of senior executives who have no technical background.",
    tags: ['explanation', 'complexity'],
  },
  {
    id: 'f-a-08', title: 'Presenting a Solution to a Problem',
    description: 'Propose and justify a solution in a formal business context.',
    mode: 'formal', level: 'advanced', icon: '🧩',
    openingPrompt: "Your team has been losing clients. You've identified the issue. Present your proposed solution to the leadership team.",
    tags: ['problem-solving', 'presentation'],
  },
  {
    id: 'f-a-09', title: 'Formal Debate Participation',
    description: 'Present a structured argument and counter opposing points logically.',
    mode: 'formal', level: 'advanced', icon: '🏛️',
    openingPrompt: "The topic is: 'Remote work is more productive than office work.' You are arguing in favor. Present your opening argument.",
    tags: ['debate', 'argumentation'],
  },
  {
    id: 'f-a-10', title: 'Workplace Decision-Making Conversation',
    description: 'Navigate a complex decision with colleagues in a professional way.',
    mode: 'formal', level: 'advanced', icon: '📊',
    openingPrompt: "You must decide between two project proposals. One is safer but slower; the other is riskier but faster. How do you frame this decision for your team?",
    tags: ['decision-making', 'leadership'],
  },

  // ── CASUAL → BEGINNER ──
  {
    id: 'c-b-01', title: 'Saying Hello and Greeting a Friend',
    description: 'Practice natural, friendly greetings in everyday English.',
    mode: 'casual', level: 'beginner', icon: '👋',
    openingPrompt: "You see your friend at school for the first time after the holidays. What do you say?",
    tags: ['greeting', 'friendship'],
  },
  {
    id: 'c-b-02', title: 'Talking About Your Favorite Food',
    description: 'Describe and discuss foods you enjoy in a relaxed conversation.',
    mode: 'casual', level: 'beginner', icon: '🍕',
    openingPrompt: "Your friend asks: 'Hey, what's your absolute favorite food?' What do you say?",
    tags: ['food', 'preferences'],
  },
  {
    id: 'c-b-03', title: 'Talking About Your Family',
    description: 'Introduce and describe your family members casually.',
    mode: 'casual', level: 'beginner', icon: '👨‍👩‍👧',
    openingPrompt: "A new friend asks: 'Tell me about your family. What are they like?'",
    tags: ['family', 'personal'],
  },
  {
    id: 'c-b-04', title: "Asking 'How Are You?'",
    description: 'Have a natural back-and-forth conversation about how you feel.',
    mode: 'casual', level: 'beginner', icon: '😊',
    openingPrompt: "Your friend texts you: 'Hey! How are you doing today?'",
    tags: ['small-talk', 'feelings'],
  },
  {
    id: 'c-b-05', title: 'Talking About Your School Day',
    description: 'Share what happened at school in a natural, casual way.',
    mode: 'casual', level: 'beginner', icon: '🎒',
    openingPrompt: "Your parent asks: 'So, how was school today? Anything interesting happen?'",
    tags: ['school', 'daily-life'],
  },
  {
    id: 'c-b-06', title: 'Saying What You Like',
    description: 'Share your preferences and likes in a simple conversation.',
    mode: 'casual', level: 'beginner', icon: '❤️',
    openingPrompt: "A friend says: 'Tell me three things you really like. Anything at all!'",
    tags: ['preferences', 'self-expression'],
  },
  {
    id: 'c-b-07', title: 'Talking About Your Hobby',
    description: 'Describe what you love to do in your free time.',
    mode: 'casual', level: 'beginner', icon: '🎨',
    openingPrompt: "You've just met someone at a gathering and they ask: 'So what do you like to do when you're not in school?'",
    tags: ['hobbies', 'interests'],
  },
  {
    id: 'c-b-08', title: 'Asking Simple Questions to a Friend',
    description: 'Practice asking and answering casual everyday questions.',
    mode: 'casual', level: 'beginner', icon: '💬',
    openingPrompt: "You want to get to know a new classmate better. What questions do you ask them to start a friendly conversation?",
    tags: ['conversation', 'curiosity'],
  },
  {
    id: 'c-b-09', title: 'Talking About Your Favorite Place',
    description: 'Describe a place you love and why you enjoy it.',
    mode: 'casual', level: 'beginner', icon: '📍',
    openingPrompt: "Your friend asks: 'What's your favorite place to visit or hang out? Why do you like it?'",
    tags: ['places', 'description'],
  },
  {
    id: 'c-b-10', title: 'Saying Goodbye Casually',
    description: 'Practice natural, friendly ways to end a conversation.',
    mode: 'casual', level: 'beginner', icon: '👋',
    openingPrompt: "You've been chatting with a friend for a while and it's time to go. How do you say goodbye in a natural, friendly way?",
    tags: ['goodbye', 'social'],
  },

  // ── CASUAL → INTERMEDIATE ──
  {
    id: 'c-i-01', title: 'Talking About Your Weekend Plans',
    description: 'Discuss what you plan to do over the weekend in a natural way.',
    mode: 'casual', level: 'intermediate', icon: '📅',
    openingPrompt: "It's Friday afternoon and your friend asks: 'Got any fun plans for the weekend?'",
    tags: ['plans', 'weekend'],
  },
  {
    id: 'c-i-02', title: 'Sharing a Personal Experience',
    description: 'Tell a short, engaging story about something that happened to you.',
    mode: 'casual', level: 'intermediate', icon: '📖',
    openingPrompt: "Your friend says: 'Tell me about something interesting or funny that happened to you recently.'",
    tags: ['storytelling', 'personal'],
  },
  {
    id: 'c-i-03', title: 'Talking About Movies or Shows',
    description: 'Discuss a film or series you watched and share your thoughts.',
    mode: 'casual', level: 'intermediate', icon: '🎬',
    openingPrompt: "Your friend asks: 'Have you watched anything good lately? What did you think of it?'",
    tags: ['movies', 'entertainment'],
  },
  {
    id: 'c-i-04', title: 'Planning an Outing with Friends',
    description: 'Coordinate plans and make suggestions for a group hangout.',
    mode: 'casual', level: 'intermediate', icon: '🗺️',
    openingPrompt: "You and three friends want to hang out this weekend but can't decide what to do. How do you suggest and organize it?",
    tags: ['planning', 'social'],
  },
  {
    id: 'c-i-05', title: 'Describing Your Daily Routine',
    description: 'Walk someone through a typical day in your life.',
    mode: 'casual', level: 'intermediate', icon: '⏰',
    openingPrompt: "A pen pal from another country asks: 'What does a typical day look like for you?'",
    tags: ['routine', 'description'],
  },
  {
    id: 'c-i-06', title: 'Talking About Your Goals',
    description: 'Share your ambitions and plans for the future casually.',
    mode: 'casual', level: 'intermediate', icon: '🎯',
    openingPrompt: "A friend asks: 'So what do you actually want to do with your life? Like, what are your goals?'",
    tags: ['goals', 'future'],
  },
  {
    id: 'c-i-07', title: 'Giving Your Opinion on Something',
    description: 'Share your perspective on a topic in a friendly, natural way.',
    mode: 'casual', level: 'intermediate', icon: '💭',
    openingPrompt: "Your friend asks: 'Do you think social media is more harmful or helpful for teenagers? What do you think?'",
    tags: ['opinion', 'discussion'],
  },
  {
    id: 'c-i-08', title: 'Talking About Travel Experiences',
    description: "Share a place you've visited or a travel experience you had.",
    mode: 'casual', level: 'intermediate', icon: '✈️',
    openingPrompt: "Your friend just came back from a trip and asks: 'Have you ever traveled somewhere really memorable? Tell me about it!'",
    tags: ['travel', 'experiences'],
  },
  {
    id: 'c-i-09', title: 'Explaining Why You Like Something',
    description: 'Give reasons and details for a preference you have.',
    mode: 'casual', level: 'intermediate', icon: '⭐',
    openingPrompt: "Your friend asks: 'You always seem to love your favorite activity. Why do you like it so much?'",
    tags: ['preferences', 'reasoning'],
  },
  {
    id: 'c-i-10', title: 'Discussing Your Interests',
    description: 'Have a detailed conversation about your passions and interests.',
    mode: 'casual', level: 'intermediate', icon: '🔎',
    openingPrompt: "You're at a social event and someone says: 'So what are you really into these days? What keeps you busy?'",
    tags: ['interests', 'social'],
  },

  // ── CASUAL → ADVANCED ──
  {
    id: 'c-a-01', title: 'Storytelling (Past Experience in Detail)',
    description: 'Tell a rich, detailed story with vivid descriptions.',
    mode: 'casual', level: 'advanced', icon: '📚',
    openingPrompt: "Your friends are sharing the most interesting or challenging thing that ever happened to them. It's your turn. Tell your story.",
    tags: ['storytelling', 'advanced-narrative'],
  },
  {
    id: 'c-a-02', title: 'Giving Advice to a Friend',
    description: 'Offer thoughtful, empathetic advice to someone going through a difficult time.',
    mode: 'casual', level: 'advanced', icon: '🤗',
    openingPrompt: "Your friend says: 'I feel completely lost. I don't know what career to choose and my parents are pressuring me. What would you tell me?'",
    tags: ['advice', 'empathy'],
  },
  {
    id: 'c-a-03', title: 'Casual Argument / Disagreement',
    description: 'Disagree with a friend calmly while maintaining the relationship.',
    mode: 'casual', level: 'advanced', icon: '⚡',
    openingPrompt: "Your friend strongly believes that people should not eat meat for ethical reasons. You disagree. How do you handle this conversation without losing the friendship?",
    tags: ['disagreement', 'social-intelligence'],
  },
  {
    id: 'c-a-04', title: 'Talking About Future Ambitions',
    description: 'Discuss your long-term dreams and ambitions in depth.',
    mode: 'casual', level: 'advanced', icon: '🚀',
    openingPrompt: "A mentor asks you: 'If there were no limits — no money, no fear, no judgment — what would you do with your life?'",
    tags: ['ambition', 'vision'],
  },
  {
    id: 'c-a-05', title: 'Sharing Emotional Experiences',
    description: 'Articulate complex feelings and emotional experiences clearly.',
    mode: 'casual', level: 'advanced', icon: '💙',
    openingPrompt: "A close friend asks: 'Have you ever been through something that really changed the way you see the world? What was it?'",
    tags: ['emotion', 'depth'],
  },
  {
    id: 'c-a-06', title: 'Persuading a Friend',
    description: 'Convince someone to change their mind or take an action.',
    mode: 'casual', level: 'advanced', icon: '🎯',
    openingPrompt: "Your friend refuses to exercise or adopt healthier habits. They say they're fine as they are. How do you gently but effectively persuade them to make a change?",
    tags: ['persuasion', 'communication'],
  },
  {
    id: 'c-a-07', title: 'Deep Discussion About Life Choices',
    description: 'Have a thoughtful, mature conversation about important life decisions.',
    mode: 'casual', level: 'advanced', icon: '🌍',
    openingPrompt: "Your friend says: 'Do you think people should follow their passion or be practical about their career? I can't decide what to do.' Have a real conversation about it.",
    tags: ['life-choices', 'philosophy'],
  },
  {
    id: 'c-a-08', title: 'Talking About Personal Challenges',
    description: "Open up about difficulties you've faced and how you handled them.",
    mode: 'casual', level: 'advanced', icon: '💪',
    openingPrompt: "A trusted friend says: 'I know you've been through some tough things. How do you personally deal with challenges when everything feels hard?'",
    tags: ['challenges', 'resilience'],
  },
  {
    id: 'c-a-09', title: 'Expressing Strong Opinions',
    description: 'Share a controversial or strong opinion while being respectful.',
    mode: 'casual', level: 'advanced', icon: '🔥',
    openingPrompt: "Your friend asks: 'What's something you feel really strongly about that most people around you don't seem to care about?'",
    tags: ['opinions', 'conviction'],
  },
  {
    id: 'c-a-10', title: 'Reflecting on Past Decisions',
    description: 'Look back on a past decision and analyze it with honesty.',
    mode: 'casual', level: 'advanced', icon: '🔮',
    openingPrompt: "Your mentor asks: 'If you could go back and change one decision you made, what would it be and why? And what did you learn from it?'",
    tags: ['reflection', 'growth'],
  },
];

// ── Helper functions ────────────────────────────────────────────────────────

export function getScenariosByMode(mode: 'formal' | 'casual'): FluviScenario[] {
  return SCENARIOS.filter((s) => s.mode === mode);
}

export function getScenariosByLevel(level: 'beginner' | 'intermediate' | 'advanced'): FluviScenario[] {
  return SCENARIOS.filter((s) => s.level === level);
}

export function getRecommendedScenarios(
  mode: 'formal' | 'casual',
  level: 'beginner' | 'intermediate' | 'advanced',
  limit = 6,
): FluviScenario[] {
  const same = SCENARIOS.filter((s) => s.mode === mode && s.level === level);
  const adjacent = SCENARIOS.filter((s) => s.mode === mode && s.level !== level);
  return [...same, ...adjacent].slice(0, limit);
}

export function getScenarioById(id: string): FluviScenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
