// BrainBoost Zone — Question Banks & Daily Seeding
// Questions are picked using a daily seed so they rotate every login.

export type QuizType = "odd-word" | "spelling" | "fix-idiom";

export interface OddWordQuestion {
  type: "odd-word";
  id: string;
  words: [string, string, string, string];
  oddIndex: number; // 0-3, the word that does NOT belong
  explanation: string;
}

export interface SpellingQuestion {
  type: "spelling";
  id: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface IdiomQuestion {
  type: "fix-idiom";
  id: string;
  scrambled: string[]; // shown to user as tiles to click
  correct: string[]; // correct word order
  explanation: string;
}

export type QuizQuestion = OddWordQuestion | SpellingQuestion | IdiomQuestion;

// ─── Quiz 1: Find the Odd Word ────────────────────────────────────────────────
const oddWordBank: OddWordQuestion[] = [
  // Easy
  { type: "odd-word", id: "ow1", words: ["Happy", "Joyful", "Sad", "Cheerful"], oddIndex: 2, explanation: '"Sad" means the opposite of happy, while Happy, Joyful, and Cheerful all share the meaning of being in a good mood.' },
  { type: "odd-word", id: "ow2", words: ["Big", "Large", "Huge", "Tiny"], oddIndex: 3, explanation: '"Tiny" means very small, while Big, Large, and Huge all mean large in size.' },
  { type: "odd-word", id: "ow3", words: ["Fast", "Quick", "Rapid", "Slow"], oddIndex: 3, explanation: '"Slow" is the opposite of fast. Fast, Quick, and Rapid all mean moving at high speed.' },
  { type: "odd-word", id: "ow4", words: ["Cold", "Freezing", "Hot", "Icy"], oddIndex: 2, explanation: '"Hot" means warm or burning, while Cold, Freezing, and Icy all describe low temperatures.' },
  { type: "odd-word", id: "ow5", words: ["Brave", "Bold", "Courageous", "Fearful"], oddIndex: 3, explanation: '"Fearful" means scared, while Brave, Bold, and Courageous all mean having courage.' },
  { type: "odd-word", id: "ow6", words: ["Smart", "Clever", "Bright", "Foolish"], oddIndex: 3, explanation: '"Foolish" means lacking good sense, while Smart, Clever, and Bright all mean intelligent.' },
  { type: "odd-word", id: "ow7", words: ["Angry", "Furious", "Mad", "Peaceful"], oddIndex: 3, explanation: '"Peaceful" means calm, while Angry, Furious, and Mad all express strong displeasure.' },
  // Medium
  { type: "odd-word", id: "ow8", words: ["Generous", "Stingy", "Giving", "Charitable"], oddIndex: 1, explanation: '"Stingy" means unwilling to give, while Generous, Giving, and Charitable all mean willing to give freely.' },
  { type: "odd-word", id: "ow9", words: ["Ancient", "Modern", "Old", "Antique"], oddIndex: 1, explanation: '"Modern" means current or new, while Ancient, Old, and Antique all relate to things from the past.' },
  { type: "odd-word", id: "ow10", words: ["Tranquil", "Serene", "Peaceful", "Chaotic"], oddIndex: 3, explanation: '"Chaotic" means disorderly and noisy, while Tranquil, Serene, and Peaceful all mean calm and quiet.' },
  { type: "odd-word", id: "ow11", words: ["Eloquent", "Articulate", "Fluent", "Mumbling"], oddIndex: 3, explanation: '"Mumbling" means speaking unclearly, while Eloquent, Articulate, and Fluent all describe clear, well-spoken language.' },
  { type: "odd-word", id: "ow12", words: ["Benevolent", "Kind", "Cruel", "Compassionate"], oddIndex: 2, explanation: '"Cruel" means causing pain deliberately, while Benevolent, Kind, and Compassionate all relate to showing warmth and care.' },
  { type: "odd-word", id: "ow13", words: ["Frugal", "Thrifty", "Economical", "Extravagant"], oddIndex: 3, explanation: '"Extravagant" means spending excessively, while Frugal, Thrifty, and Economical all mean spending carefully.' },
  { type: "odd-word", id: "ow14", words: ["Diligent", "Industrious", "Lazy", "Hardworking"], oddIndex: 2, explanation: '"Lazy" means unwilling to work, while Diligent, Industrious, and Hardworking all mean putting in strong effort.' },
  // Hard
  { type: "odd-word", id: "ow15", words: ["Sanguine", "Optimistic", "Pessimistic", "Hopeful"], oddIndex: 2, explanation: '"Pessimistic" means expecting bad outcomes, while Sanguine, Optimistic, and Hopeful all mean having a positive outlook.' },
  { type: "odd-word", id: "ow16", words: ["Loquacious", "Garrulous", "Verbose", "Taciturn"], oddIndex: 3, explanation: '"Taciturn" means saying very little, while Loquacious, Garrulous, and Verbose all mean talking too much.' },
  { type: "odd-word", id: "ow17", words: ["Ephemeral", "Transient", "Fleeting", "Permanent"], oddIndex: 3, explanation: '"Permanent" means lasting forever, while Ephemeral, Transient, and Fleeting all mean lasting only a short time.' },
  { type: "odd-word", id: "ow18", words: ["Magnanimous", "Petty", "Generous", "Beneficent"], oddIndex: 1, explanation: '"Petty" means narrow-minded and ungenerous, while Magnanimous, Generous, and Beneficent all describe great-hearted generosity.' },
  { type: "odd-word", id: "ow19", words: ["Melancholy", "Despondent", "Elated", "Somber"], oddIndex: 2, explanation: '"Elated" means joyfully excited, while Melancholy, Despondent, and Somber all describe feelings of sadness or gloom.' },
  { type: "odd-word", id: "ow20", words: ["Bellicose", "Pugnacious", "Pacifist", "Combative"], oddIndex: 2, explanation: '"Pacifist" means someone opposed to conflict, while Bellicose, Pugnacious, and Combative all mean eager to argue or fight.' },
  { type: "odd-word", id: "ow21", words: ["Tenacious", "Resolute", "Vacillating", "Steadfast"], oddIndex: 2, explanation: '"Vacillating" means being indecisive, while Tenacious, Resolute, and Steadfast all mean determined and unwavering.' },
];

// ─── Quiz 2: Spot the Correct Spelling ───────────────────────────────────────
const spellingBank: SpellingQuestion[] = [
  // Easy (common everyday words people often misspell)
  { type: "spelling", id: "sp1", options: ["receive", "recieve", "receve", "receeve"], correctIndex: 0, explanation: '"Receive" follows the rule: "i before e, except after c." The letter C comes before, so it is R-E-C-E-I-V-E.' },
  { type: "spelling", id: "sp2", options: ["beleive", "believe", "beleeve", "belive"], correctIndex: 1, explanation: '"Believe" — remember: you must BE-LIEVE. The "i before e" rule applies here since there is no C before it.' },
  { type: "spelling", id: "sp3", options: ["freind", "frend", "friend", "friand"], correctIndex: 2, explanation: '"Friend" — think of "fri-END." A friend is there to the end. The correct order is F-R-I-E-N-D.' },
  { type: "spelling", id: "sp4", options: ["seperate", "separete", "seperrate", "separate"], correctIndex: 3, explanation: '"Separate" — remember there is "a rat" inside: sep-A-RAT-e. A common mistake is writing "seperate."' },
  { type: "spelling", id: "sp5", options: ["tommorrow", "tomorrow", "tomorow", "tommorow"], correctIndex: 1, explanation: '"Tomorrow" has one M and two Rs: TO-MOR-ROW. A common mistake is doubling the M.' },
  { type: "spelling", id: "sp6", options: ["beautifull", "beautifal", "beautiful", "beutiful"], correctIndex: 2, explanation: '"Beautiful" — break it down: BEAU-TI-FUL. Only one L at the end, and the full base word is "beauty."' },
  { type: "spelling", id: "sp7", options: ["necesary", "neccesary", "neccessary", "necessary"], correctIndex: 3, explanation: '"Necessary" — one C, double S: NE-C-ES-SAR-Y. Tip: one Collar, two Socks (1C, 2S).' },
  // Medium (multi-syllable, tricky patterns)
  { type: "spelling", id: "sp8", options: ["occurence", "occurrence", "ocurrence", "occurrance"], correctIndex: 1, explanation: '"Occurrence" has double C and double R: OC-CUR-RENCE. Both the C and R are doubled.' },
  { type: "spelling", id: "sp9", options: ["accomodate", "acommodate", "accommoddate", "accommodate"], correctIndex: 3, explanation: '"Accommodate" has double C and double M: AC-COM-MO-DATE. Both C and M are doubled.' },
  { type: "spelling", id: "sp10", options: ["concience", "conscience", "consciance", "consceince"], correctIndex: 1, explanation: '"Conscience" — think CON-SCIENCE. The word "science" is hidden inside conscience.' },
  { type: "spelling", id: "sp11", options: ["privilege", "privelege", "privelage", "priviledge"], correctIndex: 0, explanation: '"Privilege" — PRIV-I-LEGE. There is no D before the GE, a common error (not "priviledge").' },
  { type: "spelling", id: "sp12", options: ["lieutanant", "liutenant", "lieutenant", "leiutenant"], correctIndex: 2, explanation: '"Lieutenant" — LIEU-TEN-ANT. The unusual "lieu" spelling comes from the French word meaning "in place of."' },
  { type: "spelling", id: "sp13", options: ["millenium", "milenium", "millenneum", "millennium"], correctIndex: 3, explanation: '"Millennium" has double L and double N: MIL-LEN-NI-UM. It refers to a thousand years (mille = thousand in Latin).' },
  { type: "spelling", id: "sp14", options: ["embarass", "embarras", "embarrass", "embarres"], correctIndex: 2, explanation: '"Embarrass" has double R and double S: EM-BAR-RASS. Think of being Really Really Stressed: two Rs, two Ss.' },
  // Hard (long, complex words)
  { type: "spelling", id: "sp15", options: ["consciencious", "conscientous", "conscientious", "consciencous"], correctIndex: 2, explanation: '"Conscientious" — CON-SCI-EN-TIOUS. It contains both "science" and ends in "-tious." Seven syllables make this one of the trickiest English words.' },
  { type: "spelling", id: "sp16", options: ["idiosyncracy", "ideosyncrasy", "idiosyncrasy", "idiosinkrasy"], correctIndex: 2, explanation: '"Idiosyncrasy" — ID-IO-SYN-CRA-SY. Note it ends in "-crasy" not "-cracy." It means a personal quirk or habit.' },
  { type: "spelling", id: "sp17", options: ["dyscalculia", "dyscalcolia", "discalculia", "dyscalculia"], correctIndex: 0, explanation: '"Dyscalculia" — DYS-CAL-CU-LI-A. The prefix "dys-" (not "dis-") means difficulty. It refers to difficulty with numbers.' },
  { type: "spelling", id: "sp18", options: ["mneumonic", "pneumonic", "mnemonic", "neumonic"], correctIndex: 2, explanation: '"Mnemonic" — MNE-MON-IC. The silent M at the start comes from the Greek goddess of memory, Mnemosyne.' },
  { type: "spelling", id: "sp19", options: ["supercede", "supersede", "superceed", "superseed"], correctIndex: 1, explanation: '"Supersede" — SU-PER-SEDE. It ends in "-sede" not "-cede." It is the only English word ending in "-sede."' },
  { type: "spelling", id: "sp20", options: ["pharenheit", "farenheit", "fahrenheit", "farhenheit"], correctIndex: 2, explanation: '"Fahrenheit" — FAHR-EN-HEIT. Named after Daniel Gabriel Fahrenheit, the German physicist. Note the silent H after "Fa."' },
  { type: "spelling", id: "sp21", options: ["burocracy", "beaurocracy", "bureaucracy", "beureaucracy"], correctIndex: 2, explanation: '"Bureaucracy" — BURE-AU-CRA-CY. The unusual "bureau" spelling comes from French, meaning "office." Bureau + cracy (rule).' },
];

// ─── Quiz 3: Fix the Idiom ────────────────────────────────────────────────────
const idiomBank: IdiomQuestion[] = [
  // Easy
  { type: "fix-idiom", id: "id1", scrambled: ["never", "late", "better", "than"], correct: ["better", "late", "than", "never"], explanation: '"Better late than never" means it is better to do something late than not do it at all.' },
  { type: "fix-idiom", id: "id2", scrambled: ["perfect", "practice", "makes"], correct: ["practice", "makes", "perfect"], explanation: '"Practice makes perfect" means that doing something repeatedly helps you improve.' },
  { type: "fix-idiom", id: "id3", scrambled: ["worm", "early", "catches", "the", "bird", "the"], correct: ["the", "early", "bird", "catches", "the", "worm"], explanation: '"The early bird catches the worm" means that those who start early have an advantage.' },
  { type: "fix-idiom", id: "id4", scrambled: ["lining", "silver", "every", "cloud", "has", "a"], correct: ["every", "cloud", "has", "a", "silver", "lining"], explanation: '"Every cloud has a silver lining" means that every difficult situation has a positive aspect.' },
  { type: "fix-idiom", id: "id5", scrambled: ["its", "by", "a", "don't", "cover", "judge", "book"], correct: ["don't", "judge", "a", "book", "by", "its", "cover"], explanation: '"Don\'t judge a book by its cover" means do not form an opinion based on appearances alone.' },
  { type: "fix-idiom", id: "id6", scrambled: ["are", "two", "better", "one", "than", "heads"], correct: ["two", "heads", "are", "better", "than", "one"], explanation: '"Two heads are better than one" means that working together produces better results than working alone.' },
  { type: "fix-idiom", id: "id7", scrambled: ["while", "fun", "having", "flies", "you", "are", "time"], correct: ["time", "flies", "when", "you", "are", "having", "fun"], explanation: '"Time flies when you are having fun" means that enjoyable experiences seem to pass very quickly. Note: "when" was hidden in the scramble!' },
  // Medium
  { type: "fix-idiom", id: "id8", scrambled: ["in", "nine", "saves", "a", "time", "stitch"], correct: ["a", "stitch", "in", "time", "saves", "nine"], explanation: '"A stitch in time saves nine" means that fixing a small problem early prevents it from becoming a big problem later.' },
  { type: "fix-idiom", id: "id9", scrambled: ["all", "not", "that", "is", "glitters", "gold"], correct: ["all", "that", "glitters", "is", "not", "gold"], explanation: '"All that glitters is not gold" means that things that look attractive on the outside are not always valuable.' },
  { type: "fix-idiom", id: "id10", scrambled: ["earned", "penny", "saved", "a", "is", "a", "penny"], correct: ["a", "penny", "saved", "is", "a", "penny", "earned"], explanation: '"A penny saved is a penny earned" means that money not spent is just as good as money earned.' },
  { type: "fix-idiom", id: "id11", scrambled: ["the", "mightier", "sword", "than", "pen", "is", "the"], correct: ["the", "pen", "is", "mightier", "than", "the", "sword"], explanation: '"The pen is mightier than the sword" means that writing and communication are more powerful than violence.' },
  { type: "fix-idiom", id: "id12", scrambled: ["together", "feather", "birds", "a", "of", "flock"], correct: ["birds", "of", "a", "feather", "flock", "together"], explanation: '"Birds of a feather flock together" means that people with similar interests tend to spend time together.' },
  { type: "fix-idiom", id: "id13", scrambled: ["is", "there", "there", "a", "will", "a", "way", "where"], correct: ["where", "there", "is", "a", "will", "there", "is", "a", "way"], explanation: '"Where there is a will there is a way" means that if you are determined enough, you will find a way to achieve your goal.' },
  { type: "fix-idiom", id: "id14", scrambled: ["your", "eggs", "one", "all", "in", "put", "basket", "don't"], correct: ["don't", "put", "all", "your", "eggs", "in", "one", "basket"], explanation: '"Don\'t put all your eggs in one basket" means do not rely on a single plan or resource.' },
  // Hard
  { type: "fix-idiom", id: "id15", scrambled: ["greener", "other", "the", "always", "is", "grass", "side", "on", "the", "the"], correct: ["the", "grass", "is", "always", "greener", "on", "the", "other", "side"], explanation: '"The grass is always greener on the other side" means people often believe others have a better situation than their own.' },
  { type: "fix-idiom", id: "id16", scrambled: ["stone", "moss", "rolling", "no", "gathers", "a"], correct: ["a", "rolling", "stone", "gathers", "no", "moss"], explanation: '"A rolling stone gathers no moss" means a person who does not settle in one place will not build lasting relationships or wealth.' },
  { type: "fix-idiom", id: "id17", scrambled: ["are", "things", "best", "free", "the", "life", "in"], correct: ["the", "best", "things", "in", "life", "are", "free"], explanation: '"The best things in life are free" means the most valuable and meaningful things in life, like love and friendship, do not cost money.' },
  { type: "fix-idiom", id: "id18", scrambled: ["the", "do", "romans", "as", "rome", "when", "in", "do"], correct: ["when", "in", "rome", "do", "as", "the", "romans", "do"], explanation: '"When in Rome do as the Romans do" means you should follow the customs and behaviors of the place you are visiting.' },
  { type: "fix-idiom", id: "id19", scrambled: ["invention", "necessity", "mother", "the", "is", "of"], correct: ["necessity", "is", "the", "mother", "of", "invention"], explanation: '"Necessity is the mother of invention" means that difficult situations inspire people to find creative solutions.' },
  { type: "fix-idiom", id: "id20", scrambled: ["before", "where", "angels", "in", "fear", "fools", "to", "rush", "tread"], correct: ["fools", "rush", "in", "where", "angels", "fear", "to", "tread"], explanation: '"Fools rush in where angels fear to tread" means that inexperienced people act carelessly in situations that wiser people would avoid.' },
  { type: "fix-idiom", id: "id21", scrambled: ["two", "kill", "one", "with", "birds", "stone", "a"], correct: ["kill", "two", "birds", "with", "one", "stone"], explanation: '"Kill two birds with one stone" means to accomplish two tasks with a single action, saving time and effort.' },
];

// ─── Daily Seeding Logic ──────────────────────────────────────────────────────
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s = s ^ (s >>> 16);
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getDailyQuestions(type: QuizType): QuizQuestion[] {
  // Rotate every calendar day — same order for everyone on the same day
  const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);
  const seed = daysSinceEpoch * 2654435761 + type.charCodeAt(0);
  const bank: QuizQuestion[] = type === "odd-word" ? oddWordBank : type === "spelling" ? spellingBank : idiomBank;
  return seededShuffle(bank, seed).slice(0, 7);
}

export const quizMeta: Record<QuizType, { title: string; emoji: string; description: string; color: string }> = {
  "odd-word": {
    title: "Find the Odd Word",
    emoji: "🧠",
    description: "Three words share a meaning — one is the odd one out. Can you spot it?",
    color: "from-teal-500 to-cyan-400",
  },
  spelling: {
    title: "Spot the Correct Spelling",
    emoji: "✍️",
    description: "Four spellings, only one is right. Choose wisely — difficulty increases!",
    color: "from-blue-500 to-indigo-400",
  },
  "fix-idiom": {
    title: "Fix the Idiom",
    emoji: "💬",
    description: "Rearrange the word tiles to rebuild the famous English phrase.",
    color: "from-accent-primary to-accent-secondary",
  },
};

export const correctEmojis = ["🎉", "👏", "😊", "🌟", "✨", "🔥", "💪", "🎯"];
export const wrongEmojis = ["💡", "🤔", "📖", "💪"];
