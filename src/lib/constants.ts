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
    category: "Speaking Confidence",
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
    id: "formal-beginner-introduce-to-teacher",
    title: "Introducing Yourself to a Teacher",
    description: "Introduce yourself respectfully to a new teacher on the first day.",
    category: "Education",
    iconName: "GraduationCap",
    goals: ["State your name clearly", "Mention one thing about yourself", "Use polite formal language"],
    starterPrompts: [
      "Your new teacher has asked everyone to introduce themselves. It is your turn.",
      "The teacher wants to know your name and one thing about you. Speak politely."
    ],
    followUpPrompts: [
      "What subject are you most interested in this year?",
      "How would you greet your teacher formally at the start of class?"
    ],
    culturalNotes: [
      "In formal school settings, always address teachers as 'Sir', 'Ma'am', or by their title.",
      "A short, clear introduction sounds more respectful than a long one in a classroom."
    ],
    voiceSample: "Good morning. My name is Arjun, and I am very happy to be in your class this year."
  },
  {
    id: "formal-beginner-ask-permission-enter",
    title: "Asking Permission to Enter",
    description: "Ask a teacher politely if you may enter the classroom.",
    category: "Education",
    iconName: "Library",
    goals: ["Greet the teacher", "Apologize for being late", "Ask permission to enter"],
    starterPrompts: [
      "You are late to class. Knock and ask the teacher if you may come in.",
      "The teacher looks at you from the door. Ask for permission to enter politely."
    ],
    followUpPrompts: [
      "How would you explain why you are late without making excuses?",
      "What do you say after the teacher lets you in?"
    ],
    culturalNotes: [
      "Always greet the teacher first before asking permission.",
      "A brief apology shows respect and helps the conversation go more smoothly."
    ],
    voiceSample: "Good morning, ma'am. I am sorry I am late. May I please come in?"
  },
  {
    id: "formal-beginner-request-homework-help",
    title: "Requesting Homework Help",
    description: "Ask your teacher politely for help with an assignment.",
    category: "Education",
    iconName: "BadgeHelp",
    goals: ["Explain what you do not understand", "Ask a clear question", "Sound respectful"],
    starterPrompts: [
      "You do not understand part of your homework. Ask your teacher for help.",
      "Tell the teacher which question is confusing and ask how to approach it."
    ],
    followUpPrompts: [
      "How would you ask for more time if the homework is too difficult?",
      "What would you say if you need the teacher to explain again?"
    ],
    culturalNotes: [
      "Saying 'I tried but I am confused about...' shows effort.",
      "Asking specific questions gets more helpful answers than general ones."
    ],
    voiceSample: "Excuse me, sir. I tried question three, but I am not sure I understood it correctly."
  },
  {
    id: "formal-beginner-greet-staff-member",
    title: "Greeting a Staff Member",
    description: "Greet a school staff member you meet in the hallway.",
    category: "Education",
    iconName: "HeartHandshake",
    goals: ["Use a formal greeting", "Be polite and brief", "Sound confident"],
    starterPrompts: [
      "You pass a school staff member in the hallway. Greet them respectfully.",
      "A staff member looks at you as you walk by. What do you say?"
    ],
    followUpPrompts: [
      "How would you greet a teacher you do not know by name?",
      "What is the difference between greeting a friend and greeting a staff member?"
    ],
    culturalNotes: [
      "Simple greetings like 'Good morning' or 'Good afternoon' are appropriate.",
      "Making eye contact and smiling helps a formal greeting feel warm."
    ],
    voiceSample: "Good afternoon, ma'am. I hope you are having a nice day."
  },
  {
    id: "formal-beginner-ask-question-in-class",
    title: "Asking a Question in Class",
    description: "Raise your hand and ask the teacher a question.",
    category: "Education",
    iconName: "MessageCircle",
    goals: ["Get attention politely", "Ask a clear question", "Use classroom language"],
    starterPrompts: [
      "You did not understand something the teacher said. Ask politely.",
      "You have a question about today's topic. How do you ask the teacher?"
    ],
    followUpPrompts: [
      "How would you ask the teacher to repeat something you missed?",
      "What phrase helps you sound polite when asking in class?"
    ],
    culturalNotes: [
      "Saying 'Excuse me' before asking shows good classroom manners.",
      "Keeping questions short and clear helps the teacher answer quickly."
    ],
    voiceSample: "Excuse me, sir. Could you please explain what you meant by that last point?"
  },
  {
    id: "formal-beginner-thank-teacher",
    title: "Thanking a Teacher",
    description: "Express gratitude to a teacher who helped you.",
    category: "Education",
    iconName: "HandHelping",
    goals: ["Express thanks clearly", "Mention one specific thing", "Sound polite"],
    starterPrompts: [
      "Your teacher helped you understand something difficult. Thank them.",
      "The lesson was very helpful. Tell your teacher you appreciated it."
    ],
    followUpPrompts: [
      "How would you thank a teacher in front of the whole class?",
      "What can you say to make your thanks sound more specific?"
    ],
    culturalNotes: [
      "Specific thanks, like 'Thank you for explaining...' sounds more sincere.",
      "Teachers appreciate knowing what part of the lesson helped most."
    ],
    voiceSample: "Thank you so much for explaining that topic today. I understand it clearly now."
  },
  {
    id: "formal-beginner-ask-directions",
    title: "Asking for Directions",
    description: "Ask a teacher or staff member where to find a room.",
    category: "Education",
    iconName: "ScanSearch",
    goals: ["Ask for directions politely", "Confirm the route", "Thank the person"],
    starterPrompts: [
      "You cannot find the library. Ask a teacher nearby for directions.",
      "You need to reach the principal's office. Ask a staff member how to get there."
    ],
    followUpPrompts: [
      "How do you confirm the directions to make sure you understood?",
      "What do you say if you get lost and need to ask again?"
    ],
    culturalNotes: [
      "Always start with 'Excuse me' when approaching a teacher.",
      "Repeating the directions back is a polite way to confirm."
    ],
    voiceSample: "Excuse me, sir. Could you please tell me how to get to the science lab from here?"
  },
  {
    id: "formal-beginner-speaking-attendance",
    title: "Speaking During Attendance",
    description: "Respond clearly when your name is called during attendance.",
    category: "Education",
    iconName: "UserPlus",
    goals: ["Respond promptly", "Use formal language", "Sound confident"],
    starterPrompts: [
      "The teacher is calling the attendance roll. Respond when your name is called.",
      "Practice what you say when a teacher calls your name."
    ],
    followUpPrompts: [
      "How would you explain that a classmate is absent?",
      "What do you say if the teacher mispronounces your name?"
    ],
    culturalNotes: [
      "A clear 'Present' or 'Yes, sir/ma'am' is the standard response.",
      "Politely correcting mispronunciation is acceptable in a classroom."
    ],
    voiceSample: "Present, ma'am."
  },
  {
    id: "formal-beginner-class-introduction",
    title: "Class Introduction",
    description: "Give a brief self-introduction to your class.",
    category: "Education",
    iconName: "Presentation",
    goals: ["State your name", "Share one interest", "Sound calm"],
    starterPrompts: [
      "Your teacher asks you to introduce yourself to the class in a few sentences.",
      "Stand up and give a short formal introduction."
    ],
    followUpPrompts: [
      "What is one goal you have for this school year?",
      "How would you describe your favourite subject to the class?"
    ],
    culturalNotes: [
      "Speak slowly and loudly enough for everyone to hear.",
      "A smile while speaking helps you seem approachable."
    ],
    voiceSample: "Good morning, everyone. My name is Priya. I enjoy reading and I look forward to learning together."
  },
  {
    id: "formal-beginner-ask-clarification",
    title: "Asking for Clarification",
    description: "Ask a teacher to clarify something you did not understand.",
    category: "Education",
    iconName: "BadgeHelp",
    goals: ["Explain what is unclear", "Ask a focused question", "Use polite language"],
    starterPrompts: [
      "The teacher gave an instruction you did not understand. Ask for clarification.",
      "You are unsure whether you understood the assignment. Ask to clarify."
    ],
    followUpPrompts: [
      "How would you confirm that your understanding is now correct?",
      "What phrase helps you ask for clarification without sounding impolite?"
    ],
    culturalNotes: [
      "Asking for clarification shows you are engaged.",
      "Phrases like 'Could you please clarify...' sound polite."
    ],
    voiceSample: "Excuse me, ma'am. Could you please clarify whether we need to submit this today?"
  }
];


const formalIntermediateSeeds: ScenarioSeed[] = [
  {
    id: "formal-intermediate-job-interview",
    title: "Attending a Job Interview",
    description: "Answer questions clearly during a professional interview.",
    category: "Work",
    iconName: "Briefcase",
    goals: ["Describe your experience", "Sound confident", "Provide clear examples"],
    starterPrompts: [
      "Tell me about a time you solved a difficult problem at work.",
      "Why are you interested in this position?"
    ],
    followUpPrompts: [
      "What was the biggest challenge you faced during that project?",
      "How do you handle working under a tight deadline?"
    ],
    culturalNotes: [
      "Use the STAR method (Situation, Task, Action, Result) for behavioral questions.",
      "Keep answers concise but detailed enough to show your capability."
    ],
    voiceSample: "In my previous role, I handled a similar situation by reorganizing our task list and prioritizing the most urgent items."
  },
  {
    id: "formal-intermediate-class-presentation",
    title: "Giving a Classroom Presentation",
    description: "Deliver a structured presentation to your class.",
    category: "Education",
    iconName: "Presentation",
    goals: ["Introduce the topic", "Explain key points clearly", "Conclude effectively"],
    starterPrompts: [
      "Begin your presentation by introducing your main topic to the class.",
      "Explain the first key point of your research."
    ],
    followUpPrompts: [
      "How would you answer a question from a classmate about your sources?",
      "How do you transition smoothly to the next point?"
    ],
    culturalNotes: [
      "Start by greeting your audience and clearly stating the purpose of the presentation.",
      "Pacing and clear enunciation are key to a successful presentation."
    ],
    voiceSample: "Good morning. Today I will be presenting our findings on renewable energy sources, starting with solar power."
  },
  {
    id: "formal-intermediate-explain-concept",
    title: "Explaining a Simple Concept",
    description: "Explain an idea clearly to someone who is unfamiliar with it.",
    category: "Work",
    iconName: "MessageCircle",
    goals: ["Use simple terms", "Check for understanding", "Provide an example"],
    starterPrompts: [
      "A colleague asks you to explain how the new software works. Give a brief overview.",
      "Explain the basic rules of a project to a new team member."
    ],
    followUpPrompts: [
      "What do you say if they still seem confused?",
      "How would you summarize the main point?"
    ],
    culturalNotes: [
      "Avoid jargon when explaining something to a beginner.",
      "Using analogies often helps clarify abstract concepts."
    ],
    voiceSample: "The new system works like a digital filing cabinet. You can search for any document by typing the client's name."
  },
  {
    id: "formal-intermediate-group-discussion",
    title: "Participating in a Group Discussion",
    description: "Share your thoughts politely during a formal meeting.",
    category: "Work",
    iconName: "Users",
    goals: ["Express your opinion", "Acknowledge others' points", "Stay on topic"],
    starterPrompts: [
      "The team is discussing a new strategy. Share your thoughts on the proposed timeline.",
      "Respond to a colleague's idea with constructive feedback."
    ],
    followUpPrompts: [
      "How would you politely disagree with someone's suggestion?",
      "What do you say to build upon another person's idea?"
    ],
    culturalNotes: [
      "Saying 'I agree with [Name], and I\\'d like to add...' is a great way to contribute.",
      "Wait for your turn to speak and avoid interrupting."
    ],
    voiceSample: "I think the timeline is realistic, but we should also consider adding a buffer week for testing."
  },
  {
    id: "formal-intermediate-formal-request",
    title: "Making a Formal Request",
    description: "Ask for resources or approval professionally.",
    category: "Work",
    iconName: "HandHelping",
    goals: ["State what you need", "Provide a reason", "Use formal phrasing"],
    starterPrompts: [
      "You need to request additional budget for a project. Explain why to your manager.",
      "Ask a different department to provide data you need for your report."
    ],
    followUpPrompts: [
      "How would you respond if the request is denied?",
      "What timeline would you provide for your request?"
    ],
    culturalNotes: [
      "Formal requests should be direct but polite, often using 'Would it be possible...'.",
      "Always explain the 'why' behind the request to build a stronger case."
    ],
    voiceSample: "Would it be possible to extend the deadline by two days? We need more time to gather the final data from the client."
  },
  {
    id: "formal-intermediate-describe-skills",
    title: "Describing Your Skills",
    description: "Talk about your professional abilities clearly.",
    category: "Career",
    iconName: "ShieldCheck",
    goals: ["Highlight key skills", "Give context", "Sound professional"],
    starterPrompts: [
      "During a review, explain your strongest technical skills.",
      "A client asks about your team's expertise. Provide a clear overview."
    ],
    followUpPrompts: [
      "How would you talk about a skill you are currently trying to improve?",
      "What is an example of when you used this skill recently?"
    ],
    culturalNotes: [
      "Focus on skills relevant to the context of the conversation.",
      "Confidence is important, but avoid sounding boastful."
    ],
    voiceSample: "My main strengths are in data analysis and project management, which I use regularly to improve our team's efficiency."
  },
  {
    id: "formal-intermediate-detailed-info",
    title: "Asking for Detailed Information",
    description: "Request specific details about a task or project.",
    category: "Work",
    iconName: "ScanSearch",
    goals: ["Ask precise questions", "Clarify context", "Ensure understanding"],
    starterPrompts: [
      "You need more details about a new assignment before starting. Ask your supervisor.",
      "Request specific specifications from a supplier for a product you want to order."
    ],
    followUpPrompts: [
      "How would you summarize the information they provide to confirm?",
      "What do you say if a detail they give is contradictory?"
    ],
    culturalNotes: [
      "Prepare your questions in advance to show that you value the other person's time.",
      "Taking notes while receiving detailed information is highly professional."
    ],
    voiceSample: "Could you provide more details regarding the formatting requirements for the final report?"
  },
  {
    id: "formal-intermediate-giving-instructions",
    title: "Giving Instructions to Someone",
    description: "Explain how to complete a task clearly and politely.",
    category: "Work",
    iconName: "Wrench",
    goals: ["Outline steps logically", "Be clear and concise", "Offer help if needed"],
    starterPrompts: [
      "Explain to a new employee how to submit their weekly timesheet.",
      "Give step-by-step instructions to a client on how to access their account."
    ],
    followUpPrompts: [
      "How do you check if they understood the instructions?",
      "What should they do if they encounter an error?"
    ],
    culturalNotes: [
      "Use transition words like 'First', 'Next', and 'Finally' to structure the instructions.",
      "Always offer further assistance at the end of the explanation."
    ],
    voiceSample: "First, log into the portal. Next, select 'Timesheets' from the menu. Finally, click 'Submit' when you are done."
  },
  {
    id: "formal-intermediate-reporting-issue",
    title: "Reporting an Issue Politely",
    description: "Inform a superior or IT about a problem you encountered.",
    category: "Work",
    iconName: "BadgeHelp",
    goals: ["Describe the problem clearly", "State the impact", "Keep a professional tone"],
    starterPrompts: [
      "You notice a bug in the software the team uses. Report it to the IT department.",
      "Inform your manager that a delivery from a vendor will be delayed."
    ],
    followUpPrompts: [
      "What steps have you already taken to try and solve the problem?",
      "How urgent is this issue?"
    ],
    culturalNotes: [
      "When reporting an issue, stick to the facts and avoid emotional language.",
      "If possible, suggest a temporary workaround while the issue is being fixed."
    ],
    voiceSample: "I wanted to let you know that the server is currently down, which is preventing the team from accessing the shared files."
  },
  {
    id: "formal-intermediate-structured-questions",
    title: "Answering Structured Questions",
    description: "Provide clear, organized answers in a formal assessment.",
    category: "Education",
    iconName: "Library",
    goals: ["Answer directly", "Provide supporting evidence", "Stay concise"],
    starterPrompts: [
      "An examiner asks you to list three main causes of a historical event. Respond clearly.",
      "Answer a formal survey question about the effectiveness of a recent training program."
    ],
    followUpPrompts: [
      "Can you elaborate on your second point?",
      "How would you summarize your overall perspective in one sentence?"
    ],
    culturalNotes: [
      "In formal assessments, answer the specific question asked without digressing.",
      "Using structured phrases like 'The primary reason is...' shows clear thinking."
    ],
    voiceSample: "The training was effective primarily because it provided hands-on practice, which helped reinforce the theoretical concepts."
  }
];

const formalAdvancedSeeds: ScenarioSeed[] = [
  {
    id: "formal-advanced-professional-meeting",
    title: "Handling a Professional Meeting",
    description: "Lead a strategic meeting with key stakeholders.",
    category: "Leadership",
    iconName: "Briefcase",
    goals: ["Set the agenda", "Guide the discussion", "Summarize action items"],
    starterPrompts: [
      "You are leading the quarterly review meeting. Open the meeting and state the agenda.",
      "Transition the discussion from reviewing past performance to planning next steps."
    ],
    followUpPrompts: [
      "How do you handle a participant who is dominating the conversation?",
      "What do you say to keep the meeting on schedule?"
    ],
    culturalNotes: [
      "Effective leaders start meetings on time and respect the scheduled duration.",
      "Always end with clear action items and assigned responsibilities."
    ],
    voiceSample: "Thank you all for joining. Today we will review our Q3 results, discuss current challenges, and outline our strategy for Q4."
  },
  {
    id: "formal-advanced-formal-speech",
    title: "Delivering a Formal Speech",
    description: "Give a well-structured speech to a large audience.",
    category: "Public Speaking",
    iconName: "Presentation",
    goals: ["Engage the audience", "Deliver a clear message", "Maintain a strong presence"],
    starterPrompts: [
      "You are delivering the keynote address at a conference. Begin your speech.",
      "Deliver the concluding remarks of a formal presentation to shareholders."
    ],
    followUpPrompts: [
      "How do you use pacing to emphasize a key point?",
      "What rhetorical device can you use to make your closing memorable?"
    ],
    culturalNotes: [
      "Eye contact and purposeful pauses are crucial for effective public speaking.",
      "A strong opening hook grabs attention immediately."
    ],
    voiceSample: "We stand today at a critical juncture in our industry, facing challenges that require unprecedented innovation and collaboration."
  },
  {
    id: "formal-advanced-negotiation",
    title: "Negotiating in a Formal Setting",
    description: "Negotiate terms or a contract professionally.",
    category: "Leadership",
    iconName: "HeartHandshake",
    goals: ["State your terms", "Listen to counter-offers", "Find a compromise"],
    starterPrompts: [
      "You are negotiating a contract with a new vendor. Present your proposed terms.",
      "Respond to a counter-offer that does not meet all your requirements."
    ],
    followUpPrompts: [
      "How do you politely decline an unacceptable term?",
      "What language helps keep the negotiation collaborative rather than adversarial?"
    ],
    culturalNotes: [
      "Successful negotiation focuses on interests, not positions.",
      "Maintain a calm, professional demeanor even if the discussion becomes difficult."
    ],
    voiceSample: "While we appreciate the offer, the proposed timeline is too long for our needs. We would need delivery within four weeks to proceed."
  },
  {
    id: "formal-advanced-handling-complaint",
    title: "Handling a Complaint Professionally",
    description: "Address a serious issue raised by a client or stakeholder.",
    category: "Services",
    iconName: "ShieldCheck",
    goals: ["Acknowledge the issue", "Take responsibility", "Propose a solution"],
    starterPrompts: [
      "A major client is unhappy with the recent service outage. Address their concerns.",
      "Respond to a formal complaint from an employee regarding workplace policies."
    ],
    followUpPrompts: [
      "How do you assure them that the issue will not happen again?",
      "What steps are you taking immediately to resolve the problem?"
    ],
    culturalNotes: [
      "Empathy and active listening are essential when handling complaints.",
      "Focus on the solution rather than making excuses."
    ],
    voiceSample: "I completely understand your frustration regarding the delay. We take this matter seriously and are currently investigating the cause to prevent it from recurring."
  },
  {
    id: "formal-advanced-express-disagreement",
    title: "Expressing Disagreement Politely",
    description: "Voice a dissenting opinion constructively.",
    category: "Leadership",
    iconName: "MessageCircle",
    goals: ["Acknowledge the other view", "State your disagreement clearly", "Offer an alternative"],
    starterPrompts: [
      "During a board meeting, you disagree with the proposed budget cuts. Express your opinion.",
      "A colleague suggests a strategy you believe is flawed. Respond constructively."
    ],
    followUpPrompts: [
      "How do you back up your disagreement with data?",
      "What phrase helps soften the disagreement?"
    ],
    culturalNotes: [
      "Use 'I' statements to avoid sounding accusatory (e.g., 'I have concerns about...').",
      "Always offer an alternative solution when disagreeing with a proposal."
    ],
    voiceSample: "I see the rationale behind cutting the marketing budget, but I am concerned it might negatively impact our growth targets for the next quarter. Perhaps we could look at reducing administrative costs instead."
  },
  {
    id: "formal-advanced-team-discussion",
    title: "Leading a Team Discussion",
    description: "Facilitate a complex discussion among team members.",
    category: "Leadership",
    iconName: "Users",
    goals: ["Encourage participation", "Synthesize different ideas", "Guide towards a decision"],
    starterPrompts: [
      "Your team is brainstorming solutions to a complex problem. Guide the discussion.",
      "Two team members have conflicting ideas. Help them find common ground."
    ],
    followUpPrompts: [
      "How do you ensure quiet team members have a chance to speak?",
      "How do you summarize a long, complex discussion?"
    ],
    culturalNotes: [
      "A good facilitator remains neutral and focuses on the process of the discussion.",
      "Validating contributions encourages further participation."
    ],
    voiceSample: "We have heard some great ideas from both the design and engineering teams. Let's see how we can integrate the user-friendly interface with the robust backend architecture."
  },
  {
    id: "formal-advanced-complex-idea",
    title: "Explaining a Complex Idea",
    description: "Make a difficult concept understandable to a non-expert audience.",
    category: "Work",
    iconName: "Library",
    goals: ["Break down the concept", "Use appropriate analogies", "Check for comprehension"],
    starterPrompts: [
      "Explain the impact of the new regulatory changes to the sales team.",
      "Describe the architecture of the new database system to a non-technical manager."
    ],
    followUpPrompts: [
      "What analogy would you use to explain this concept?",
      "How do you answer a question that shows they misunderstood a key point?"
    ],
    culturalNotes: [
      "Avoid condescension when explaining complex topics to non-experts.",
      "Use clear, jargon-free language whenever possible."
    ],
    voiceSample: "Think of the new data structure like a highly organized library, where every piece of information has a specific tag, making it much faster to retrieve exactly what you need."
  },
  {
    id: "formal-advanced-present-solution",
    title: "Presenting a Solution",
    description: "Propose a formal solution to a recognized problem.",
    category: "Leadership",
    iconName: "Wrench",
    goals: ["Identify the problem", "Present the solution", "Outline the benefits"],
    starterPrompts: [
      "Present your proposed solution for the high employee turnover rate to the HR director.",
      "Pitch a new software tool to the executive board that will improve efficiency."
    ],
    followUpPrompts: [
      "How do you address potential risks associated with your solution?",
      "What is the required investment in terms of time and money?"
    ],
    culturalNotes: [
      "Focus on the ROI (Return on Investment) or value proposition of your solution.",
      "Anticipate objections and have well-reasoned responses prepared."
    ],
    voiceSample: "To address the bottlenecks in our supply chain, I propose implementing an automated tracking system, which will reduce errors by twenty percent and save us thousands in delays."
  },
  {
    id: "formal-advanced-debate-participation",
    title: "Formal Debate Participation",
    description: "Argue a position effectively in a formal debate setting.",
    category: "Education",
    iconName: "Landmark",
    goals: ["State your argument clearly", "Rebut the opponent's points", "Maintain a formal tone"],
    starterPrompts: [
      "Deliver your opening statement affirming the resolution.",
      "Provide a rebuttal to the opposing team's argument regarding economic impact."
    ],
    followUpPrompts: [
      "How do you structure your closing statement?",
      "What is the most critical weakness in the opponent's argument?"
    ],
    culturalNotes: [
      "Debates require strict adherence to rules and respectful language towards opponents.",
      "Logical coherence and factual evidence are the keys to winning an argument."
    ],
    voiceSample: "The opposing team argues that this policy will increase costs. However, our data clearly shows that the long-term savings significantly outweigh the initial investment."
  },
  {
    id: "formal-advanced-decision-making",
    title: "Workplace Decision-Making",
    description: "Discuss and finalize a major workplace decision.",
    category: "Leadership",
    iconName: "ScanSearch",
    goals: ["Evaluate options", "Discuss trade-offs", "Reach a consensus"],
    starterPrompts: [
      "You are finalizing the choice of a new vendor. Discuss the pros and cons with the committee.",
      "Lead the final discussion before approving the launch of the new product."
    ],
    followUpPrompts: [
      "How do you ensure all perspectives have been considered before deciding?",
      "What is the contingency plan if the decision leads to negative outcomes?"
    ],
    culturalNotes: [
      "Consensus-building takes time but leads to greater buy-in from the team.",
      "Clearly document the final decision and the rationale behind it."
    ],
    voiceSample: "While Vendor A offers a lower price, Vendor B has a proven track record of reliability. Given our strict deadlines, I recommend we prioritize reliability and go with Vendor B."
  }
];

const casualBeginnerSeeds: ScenarioSeed[] = [
  {
    id: "casual-beginner-hello-friend",
    title: "Saying Hello to a Friend",
    description: "Greet a friend you just met casually.",
    category: "Social",
    iconName: "Users",
    goals: ["Say hello", "Sound friendly", "Ask a basic question"],
    starterPrompts: [
      "You see your friend at the park. Greet them.",
      "Say hello to your friend when they arrive at your house."
    ],
    followUpPrompts: [
      "What do you say if you haven't seen them in a few days?",
      "How do you compliment something they are wearing?"
    ],
    culturalNotes: [
      "Casual greetings often include 'Hey' or 'Hi' instead of 'Hello'.",
      "Smiling makes the greeting feel warm."
    ],
    voiceSample: "Hey! It is so good to see you. How have you been?"
  },
  {
    id: "casual-beginner-favorite-food",
    title: "Talking About Favorite Food",
    description: "Discuss your favorite food with a friend.",
    category: "Daily Life",
    iconName: "UtensilsCrossed",
    goals: ["Name a food", "Describe why you like it", "Ask their preference"],
    starterPrompts: [
      "A friend asks what your favorite food is. Tell them.",
      "Talk about a meal you really enjoy eating."
    ],
    followUpPrompts: [
      "Can you cook this food yourself?",
      "What food do you not like at all?"
    ],
    culturalNotes: [
      "Using simple descriptive words like 'spicy', 'sweet', or 'delicious' helps.",
      "Asking 'What about you?' keeps the conversation going."
    ],
    voiceSample: "My favorite food is pizza because I love the cheese. What about you?"
  },
  {
    id: "casual-beginner-family",
    title: "Talking About Your Family",
    description: "Share simple details about your family members.",
    category: "Social",
    iconName: "Home",
    goals: ["Mention family members", "Share a simple fact", "Keep it relaxed"],
    starterPrompts: [
      "A friend asks about your family. Tell them who you live with.",
      "Describe one person in your family briefly."
    ],
    followUpPrompts: [
      "Do you have any pets?",
      "What do you like to do with your family on weekends?"
    ],
    culturalNotes: [
      "It is common to talk about siblings or parents in casual chat.",
      "Keep the details light and positive."
    ],
    voiceSample: "I live with my parents and my younger brother. He is still in middle school."
  },
  {
    id: "casual-beginner-how-are-you",
    title: "Asking 'How are you?'",
    description: "Ask someone how they are doing and respond appropriately.",
    category: "Social",
    iconName: "MessageCircle",
    goals: ["Ask the question", "Listen to the answer", "Give a brief response"],
    starterPrompts: [
      "Ask a friend how they are doing today.",
      "Your friend asks 'How are you?'. Give a natural response."
    ],
    followUpPrompts: [
      "What do you say if you are feeling a bit tired?",
      "How do you respond if they say they had a bad day?"
    ],
    culturalNotes: [
      "'I am good, thanks' is a very common and polite response.",
      "You don't always have to give a long answer."
    ],
    voiceSample: "I am doing pretty well, thanks. Just a bit tired from work. How are you?"
  },
  {
    id: "casual-beginner-school-day",
    title: "Talking About Your School Day",
    description: "Share what happened at school today.",
    category: "Education",
    iconName: "GraduationCap",
    goals: ["Mention a class or activity", "Say how it was", "Use simple past tense"],
    starterPrompts: [
      "Tell a friend what you did at school today.",
      "Someone asks how your classes were. Answer briefly."
    ],
    followUpPrompts: [
      "What was the best part of your day?",
      "Did you have any difficult assignments?"
    ],
    culturalNotes: [
      "Using 'It was fun' or 'It was boring' is common for school talk.",
      "Sharing a specific small detail makes the story more interesting."
    ],
    voiceSample: "School was okay today. We had a science experiment which was actually pretty fun."
  },
  {
    id: "casual-beginner-what-you-like",
    title: "Saying What You Like",
    description: "Express your preferences casually.",
    category: "Daily Life",
    iconName: "HeartHandshake",
    goals: ["Use 'I like'", "Mention an activity or thing", "Give a short reason"],
    starterPrompts: [
      "Tell a friend about a game or show you really like.",
      "Explain what kind of music you enjoy listening to."
    ],
    followUpPrompts: [
      "How often do you do this activity?",
      "Do you like doing this alone or with friends?"
    ],
    culturalNotes: [
      "Saying 'I\\'m really into...' is a natural casual phrase.",
      "Enthusiasm in your voice makes the conversation more engaging."
    ],
    voiceSample: "I really like playing video games on the weekend because it helps me relax."
  },
  {
    id: "casual-beginner-hobby",
    title: "Talking About Your Hobby",
    description: "Discuss what you do in your free time.",
    category: "Daily Life",
    iconName: "PartyPopper",
    goals: ["Name the hobby", "Say when you do it", "Sound enthusiastic"],
    starterPrompts: [
      "Someone asks what you do for fun. Tell them about your hobby.",
      "Describe an activity you enjoy doing after school or work."
    ],
    followUpPrompts: [
      "How long have you been doing this hobby?",
      "What do you need to do this hobby?"
    ],
    culturalNotes: [
      "Hobbies are a great way to connect with others.",
      "Offering to show them or do it together is a friendly gesture."
    ],
    voiceSample: "In my free time, I love to paint. I usually do it on Sunday afternoons."
  },
  {
    id: "casual-beginner-ask-questions",
    title: "Asking Simple Questions",
    description: "Ask a friend basic questions to learn more about them.",
    category: "Social",
    iconName: "MessageCircle",
    goals: ["Ask clearly", "Show interest", "Keep the tone light"],
    starterPrompts: [
      "Ask a friend what their favorite movie is.",
      "Ask a new friend where they grew up."
    ],
    followUpPrompts: [
      "How do you ask about their weekend plans?",
      "What do you say if you have the same answer?"
    ],
    culturalNotes: [
      "Asking questions shows you care about the other person.",
      "Follow-up questions are key to a good conversation."
    ],
    voiceSample: "So, what kind of movies do you usually like to watch?"
  },
  {
    id: "casual-beginner-favorite-place",
    title: "Talking About Your Favorite Place",
    description: "Describe a place you love to visit.",
    category: "Travel",
    iconName: "Plane",
    goals: ["Name the place", "Describe it simply", "Say why you like it"],
    starterPrompts: [
      "Tell a friend about your favorite park or cafe.",
      "Describe a place in your city that you really like."
    ],
    followUpPrompts: [
      "When is the best time to go there?",
      "Who do you usually go with?"
    ],
    culturalNotes: [
      "Using adjectives like 'quiet', 'busy', or 'beautiful' helps describe the place.",
      "People love hearing recommendations for new places."
    ],
    voiceSample: "My favorite place is the library downtown. It is very quiet and has comfortable chairs."
  },
  {
    id: "casual-beginner-saying-goodbye",
    title: "Saying Goodbye Casually",
    description: "End a conversation with a friend naturally.",
    category: "Social",
    iconName: "Users",
    goals: ["Say goodbye", "Mention seeing them later", "Be friendly"],
    starterPrompts: [
      "You have to leave. Say goodbye to your friend.",
      "End a phone call with a friend casually."
    ],
    followUpPrompts: [
      "What do you say if you will see them tomorrow?",
      "How do you say goodbye if you are in a hurry?"
    ],
    culturalNotes: [
      "'See you later' or 'Catch you later' are very common.",
      "A quick wave or smile goes well with a casual goodbye."
    ],
    voiceSample: "I have to go now. It was great talking to you. See you tomorrow!"
  }
];

const casualIntermediateSeeds: ScenarioSeed[] = [
  {
    id: "casual-intermediate-weekend-plans",
    title: "Talking About Weekend Plans",
    description: "Discuss what you are going to do this weekend.",
    category: "Social",
    iconName: "CalendarClock",
    goals: ["Use future tense", "Share details", "Ask about their plans"],
    starterPrompts: [
      "A friend asks what you are doing this weekend. Tell them your plans.",
      "Start a conversation by asking a friend about their weekend."
    ],
    followUpPrompts: [
      "What do you say if your plans are not finalized yet?",
      "How would you invite them to join you?"
    ],
    culturalNotes: [
      "Weekend plans are a very common topic for small talk.",
      "Using 'I am thinking of...' or 'I might...' sounds natural."
    ],
    voiceSample: "I am thinking of going to the beach on Saturday if the weather is nice. What are you up to?"
  },
  {
    id: "casual-intermediate-share-experience",
    title: "Sharing a Personal Experience",
    description: "Tell a short story about something that happened to you.",
    category: "Social",
    iconName: "MessageCircle",
    goals: ["Narrate clearly", "Express emotion", "Keep it engaging"],
    starterPrompts: [
      "Tell a friend about a funny thing that happened to you recently.",
      "Share an experience of a time you got lost."
    ],
    followUpPrompts: [
      "How do you build suspense in your story?",
      "What was the reaction of the people around you?"
    ],
    culturalNotes: [
      "Storytelling among friends is a great way to bond.",
      "Using expressive tone and gestures makes the story better."
    ],
    voiceSample: "You will not believe what happened yesterday. I was walking to the store and completely forgot where I was going!"
  },
  {
    id: "casual-intermediate-movies-shows",
    title: "Talking About Movies or Shows",
    description: "Discuss a movie or TV show you recently watched.",
    category: "Daily Life",
    iconName: "PartyPopper",
    goals: ["Give a brief summary", "Share your opinion", "Ask for their thoughts"],
    starterPrompts: [
      "Tell a friend about a great movie you saw last night.",
      "Discuss the latest episode of a popular TV show."
    ],
    followUpPrompts: [
      "How do you talk about a movie without giving spoilers?",
      "What didn't you like about the show?"
    ],
    culturalNotes: [
      "Discussing entertainment is universally popular.",
      "Asking 'Have you seen it?' is a good way to involve them."
    ],
    voiceSample: "I just watched that new sci-fi movie. The special effects were amazing, but the plot was a bit confusing."
  },
  {
    id: "casual-intermediate-planning-outing",
    title: "Planning an Outing with Friends",
    description: "Coordinate a meetup or activity with a group.",
    category: "Social",
    iconName: "Users",
    goals: ["Suggest an activity", "Discuss time and place", "Agree on a plan"],
    starterPrompts: [
      "Suggest going out for dinner with a couple of friends.",
      "Try to find a time when everyone is free to meet up."
    ],
    followUpPrompts: [
      "What do you say if someone cannot make that time?",
      "How do you suggest a different location politely?"
    ],
    culturalNotes: [
      "Being flexible and offering alternatives helps when planning.",
      "Group chats often require someone to take the lead to make a decision."
    ],
    voiceSample: "Are you guys free on Friday night? We could try that new Italian place downtown."
  },
  {
    id: "casual-intermediate-daily-routine",
    title: "Describing Your Daily Routine",
    description: "Talk about your typical day.",
    category: "Daily Life",
    iconName: "CalendarClock",
    goals: ["Use sequence words", "Describe habits", "Keep a steady pace"],
    starterPrompts: [
      "Describe what a normal weekday looks like for you.",
      "Explain your morning routine to a friend."
    ],
    followUpPrompts: [
      "What is your favorite part of the day?",
      "How does your routine change on the weekends?"
    ],
    culturalNotes: [
      "Using words like 'usually', 'always', and 'sometimes' adds nuance.",
      "Routines are a relatable topic for casual conversation."
    ],
    voiceSample: "I usually wake up around 7 AM, grab a quick coffee, and then read the news before starting work."
  },
  {
    id: "casual-intermediate-talking-goals",
    title: "Talking About Your Goals",
    description: "Share what you want to achieve in the future.",
    category: "Career",
    iconName: "ShieldCheck",
    goals: ["Express ambition", "Explain your motivation", "Sound determined"],
    starterPrompts: [
      "Tell a friend about a personal goal you are working towards.",
      "Discuss what you hope to achieve by the end of the year."
    ],
    followUpPrompts: [
      "What are the steps you are taking to reach this goal?",
      "What is the biggest challenge you face in achieving it?"
    ],
    culturalNotes: [
      "Sharing goals can be motivating and helps friends support you.",
      "It is okay to be unsure; sharing the process is also interesting."
    ],
    voiceSample: "My main goal right now is to save up enough money to take a trip to Europe next summer."
  },
  {
    id: "casual-intermediate-giving-opinion",
    title: "Giving Your Opinion",
    description: "Share your thoughts on a casual topic.",
    category: "Social",
    iconName: "MessageCircle",
    goals: ["State your opinion", "Provide a reason", "Ask for agreement/disagreement"],
    starterPrompts: [
      "Give your opinion on a new trend or popular topic.",
      "A friend asks what you think of a new song. Answer honestly."
    ],
    followUpPrompts: [
      "How do you express a negative opinion politely?",
      "What if you don't have a strong opinion either way?"
    ],
    culturalNotes: [
      "Phrases like 'In my opinion' or 'I feel like' soften the statement.",
      "Casual debates about trivial things can be fun."
    ],
    voiceSample: "I know a lot of people like it, but I feel like the new design is actually harder to use than the old one."
  },
  {
    id: "casual-intermediate-travel-experiences",
    title: "Talking About Travel Experiences",
    description: "Discuss a memorable trip you took.",
    category: "Travel",
    iconName: "Plane",
    goals: ["Describe the destination", "Highlight key moments", "Express excitement"],
    starterPrompts: [
      "Tell a friend about your favorite vacation.",
      "Describe a place you visited that completely surprised you."
    ],
    followUpPrompts: [
      "What was the best food you ate there?",
      "Would you go back to that place?"
    ],
    culturalNotes: [
      "Travel stories are very engaging when you include sensory details.",
      "Asking 'Have you ever been there?' includes the listener."
    ],
    voiceSample: "I went to Japan last year and it was incredible. The mix of modern cities and traditional temples was beautiful."
  },
  {
    id: "casual-intermediate-why-you-like",
    title: "Explaining Why You Like Something",
    description: "Go into detail about why you enjoy a specific thing.",
    category: "Daily Life",
    iconName: "HeartHandshake",
    goals: ["Identify the subject", "Provide specific reasons", "Sound passionate"],
    starterPrompts: [
      "Explain to a friend why a certain book is your favorite.",
      "Discuss why you prefer a certain type of weather."
    ],
    followUpPrompts: [
      "How did you first get into this?",
      "Is there anything you dislike about it?"
    ],
    culturalNotes: [
      "Passion is contagious; don't be afraid to show enthusiasm.",
      "Connecting the 'like' to a personal feeling makes the explanation stronger."
    ],
    voiceSample: "I love hiking because it completely clears my mind. Just being away from the city noise is so refreshing."
  },
  {
    id: "casual-intermediate-discussing-interests",
    title: "Discussing Your Interests",
    description: "Have a deeper conversation about your hobbies or passions.",
    category: "Daily Life",
    iconName: "PartyPopper",
    goals: ["Share knowledge", "Ask about their interests", "Find common ground"],
    starterPrompts: [
      "Talk to a friend about a topic you are both interested in.",
      "Explain a niche hobby you have to someone who doesn't know about it."
    ],
    followUpPrompts: [
      "How do you find time for this interest?",
      "What advice would you give someone starting out?"
    ],
    culturalNotes: [
      "Finding common interests is a key way to build friendships.",
      "Be careful not to dominate the conversation; let them speak too."
    ],
    voiceSample: "I have been really into photography lately. It is amazing how much you learn about lighting just by observing."
  }
];

const casualAdvancedSeeds: ScenarioSeed[] = [
  {
    id: "casual-advanced-storytelling",
    title: "Storytelling",
    description: "Tell a detailed and engaging story from your past.",
    category: "Storytelling",
    iconName: "MessageCircle",
    goals: ["Set the scene", "Build the narrative", "Deliver a strong ending"],
    starterPrompts: [
      "Tell friends about the most unbelievable thing that ever happened to you.",
      "Narrate a story about a memorable mistake you made."
    ],
    followUpPrompts: [
      "How do you use pauses for dramatic effect?",
      "What details are crucial to make the story come alive?"
    ],
    culturalNotes: [
      "Good storytelling involves pacing, expression, and knowing your audience.",
      "A mix of humor and sincerity often works best."
    ],
    voiceSample: "So there I was, stranded in the middle of nowhere with a flat tire and no cell service. Let me tell you what happened next."
  },
  {
    id: "casual-advanced-giving-advice",
    title: "Giving Advice to a Friend",
    description: "Offer thoughtful advice to a friend in a tough situation.",
    category: "Relationships",
    iconName: "HandHelping",
    goals: ["Listen actively", "Show empathy", "Offer constructive suggestions"],
    starterPrompts: [
      "A friend asks for advice about a difficult coworker. What do you say?",
      "Your friend is unsure whether to move to a new city. Help them think it through."
    ],
    followUpPrompts: [
      "How do you give advice without sounding bossy?",
      "What if they don't want to hear the truth?"
    ],
    culturalNotes: [
      "Sometimes friends just want someone to listen, not necessarily to fix the problem.",
      "Phrases like 'If I were in your shoes...' help frame the advice."
    ],
    voiceSample: "I understand why you are stressed. If I were you, I might try talking to them privately before escalating the issue."
  },
  {
    id: "casual-advanced-casual-argument",
    title: "Casual Argument or Disagreement",
    description: "Argue a point passionately but playfully with friends.",
    category: "Discussion",
    iconName: "MessageCircle",
    goals: ["Defend your view", "Keep it lighthearted", "Challenge their points"],
    starterPrompts: [
      "Argue with a friend over which superhero is the best.",
      "Have a friendly debate over the best way to cook a steak."
    ],
    followUpPrompts: [
      "How do you concede a point gracefully?",
      "How do you keep the argument from becoming genuinely angry?"
    ],
    culturalNotes: [
      "Friendly debates are a common social dynamic among close friends.",
      "Using humor diffuses tension and keeps the interaction fun."
    ],
    voiceSample: "Are you kidding? There is no way that movie is better than the original. The pacing in the first one is just perfect."
  },
  {
    id: "casual-advanced-future-ambitions",
    title: "Talking About Future Ambitions",
    description: "Discuss your long-term dreams and life plans.",
    category: "Career",
    iconName: "ShieldCheck",
    goals: ["Express vision", "Share underlying motivations", "Inspire others"],
    starterPrompts: [
      "Tell a close friend where you see yourself in ten years.",
      "Discuss a 'pipe dream' you have always wanted to pursue."
    ],
    followUpPrompts: [
      "What is the biggest obstacle standing in your way?",
      "How have your ambitions changed since you were younger?"
    ],
    culturalNotes: [
      "Vulnerability in sharing big dreams strengthens deep friendships.",
      "It's common to discuss the 'why' behind the ambition, not just the 'what'."
    ],
    voiceSample: "My ultimate dream is to open a small bakery. I know it's a lot of work, but baking brings me so much peace."
  },
  {
    id: "casual-advanced-emotional-experiences",
    title: "Sharing Emotional Experiences",
    description: "Talk about a deeply emotional or significant moment.",
    category: "Relationships",
    iconName: "HeartHandshake",
    goals: ["Express vulnerability", "Articulate complex feelings", "Connect deeply"],
    starterPrompts: [
      "Share a moment when you felt incredibly proud of someone you love.",
      "Talk about a time you experienced profound grief or loss."
    ],
    followUpPrompts: [
      "How did that experience change your perspective on life?",
      "How do you handle becoming emotional while speaking?"
    ],
    culturalNotes: [
      "Sharing deep emotions requires trust and the right setting.",
      "Active listening and offering comfort are crucial when receiving these stories."
    ],
    voiceSample: "When I saw them cross the finish line, I just started crying. I knew how hard they had worked to get there."
  },
  {
    id: "casual-advanced-persuading-friend",
    title: "Persuading a Friend",
    description: "Convince a friend to join you in an activity or change their mind.",
    category: "Discussion",
    iconName: "Users",
    goals: ["Use compelling reasons", "Address their hesitations", "Be enthusiastic"],
    starterPrompts: [
      "Convince a hesitant friend to go on a spontaneous road trip.",
      "Persuade a friend to try a new food they are nervous about."
    ],
    followUpPrompts: [
      "What is the strongest argument you can make?",
      "How do you know when to stop pushing?"
    ],
    culturalNotes: [
      "Persuasion among friends relies on knowing what appeals to them personally.",
      "Enthusiasm is often more persuasive than logical arguments."
    ],
    voiceSample: "Come on, it will be an adventure! We can leave early, take the scenic route, and be back by Sunday. You won't regret it."
  },
  {
    id: "casual-advanced-life-choices",
    title: "Deep Discussion About Life Choices",
    description: "Have a philosophical conversation about major decisions.",
    category: "Discussion",
    iconName: "Library",
    goals: ["Explore complex ideas", "Weigh different paths", "Ask probing questions"],
    starterPrompts: [
      "Discuss with a friend whether it is better to prioritize career or personal life.",
      "Talk about the concept of 'regret' regarding life decisions."
    ],
    followUpPrompts: [
      "How do societal expectations influence our choices?",
      "What role does luck play in success?"
    ],
    culturalNotes: [
      "Late-night conversations often turn to these deep, philosophical topics.",
      "The goal is exploration, not necessarily finding a definitive answer."
    ],
    voiceSample: "I often wonder if I made the right choice moving away from home. On one hand, I gained independence, but on the other, I missed out on family time."
  },
  {
    id: "casual-advanced-personal-challenges",
    title: "Talking About Personal Challenges",
    description: "Confide in a friend about a struggle you are facing.",
    category: "Relationships",
    iconName: "HeartHandshake",
    goals: ["Be honest about struggles", "Ask for support", "Maintain perspective"],
    starterPrompts: [
      "Tell a close friend about a fear you are trying to overcome.",
      "Discuss a period of burnout you are currently experiencing."
    ],
    followUpPrompts: [
      "How can your friend support you right now?",
      "What steps are you taking to address the challenge?"
    ],
    culturalNotes: [
      "Admitting struggles is a sign of strength in close friendships.",
      "Using phrases like 'I've been having a hard time with...' opens the door."
    ],
    voiceSample: "Lately, I have been really struggling to balance everything. I feel like I am always behind, and it is starting to affect my sleep."
  },
  {
    id: "casual-advanced-strong-opinions",
    title: "Expressing Strong Opinions",
    description: "State a firm belief on a controversial or significant topic.",
    category: "Discussion",
    iconName: "MessageCircle",
    goals: ["Articulate the belief clearly", "Provide strong reasoning", "Handle opposition gracefully"],
    starterPrompts: [
      "Express a strong opinion on the impact of social media.",
      "Argue why a certain societal change is absolutely necessary."
    ],
    followUpPrompts: [
      "How do you respond when someone fundamentally disagrees?",
      "What evidence supports your strong opinion?"
    ],
    culturalNotes: [
      "In advanced casual conversation, it is acceptable to have strong debates if respect is maintained.",
      "Acknowledge complexity even when holding a firm stance."
    ],
    voiceSample: "I strongly believe that we rely too much on technology for communication. We are losing the ability to have genuine, uninterrupted conversations."
  },
  {
    id: "casual-advanced-past-decisions",
    title: "Reflecting on Past Decisions",
    description: "Look back at choices you made and discuss their impact.",
    category: "Storytelling",
    iconName: "CalendarClock",
    goals: ["Analyze past events", "Acknowledge growth", "Share insights learned"],
    starterPrompts: [
      "Discuss a decision you regret and what you learned from it.",
      "Reflect on a risk you took that completely changed your life's direction."
    ],
    followUpPrompts: [
      "If you could go back, what would you do differently?",
      "How did that decision shape who you are today?"
    ],
    culturalNotes: [
      "Reflection requires self-awareness and maturity.",
      "These conversations often provide valuable lessons for the listener as well."
    ],
    voiceSample: "Looking back, quitting that job without a backup plan was incredibly risky, but it forced me to figure out what I really wanted to do."
  }
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
    beginner: ["formal-beginner-introduce-to-teacher", "casual-beginner-hello-friend", "casual-beginner-school-day"],
    intermediate: ["formal-intermediate-job-interview", "casual-intermediate-weekend-plans", "formal-intermediate-explain-concept"],
    advanced: ["formal-advanced-professional-meeting", "casual-advanced-future-ambitions", "formal-advanced-complex-idea"],
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
