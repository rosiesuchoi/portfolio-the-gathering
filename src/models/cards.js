// Card data. Pure data only: icons are referenced by key (resolved in views/icons).

export const COMMANDER_CARD = {
  id: 1,
  title: "Rosie Choi",
  actualName: "Jodah, the Unifier",
  type: "Legendary Creature — Human Wizard",
  cost: "W U B R G",
  rarity: "Mythic",
  icon: "user",
  color: "from-blue-900 via-purple-800 to-amber-600",
  borderColor: "border-[#D4AF37]",
  manaColor: "bg-gradient-to-br from-amber-200 via-purple-300 to-red-300 text-slate-900",
  stats: "5/5",
  flavor: "Undergraduate CS student at UW Tacoma (B.S. Computer Science, expected Spring 2027). Passionate about software architecture and database management.",
  effect: "Legendary creatures you control get +X/+X, where X is the number of legendary creatures you control.\n\nWhenever you cast a legendary spell from your hand, exile cards from the top of your library until you exile a legendary nonland card with lesser mana value. You may cast that card without paying its mana cost."
};

// Well-known card ids used by the game rules.
export const CARD_IDS = {
  COMMANDER: COMMANDER_CARD.id,
  RESUME: 2,
  PORTFOLIO_SITE: 3,
  BOARD_STATE_ANALYZER: 5,
  K_BEAUTY_MATCHER: 7,
  ORIANNA: 8,
  HOBBIES: 9,
  OMNISCIENCE: 10,
  VERSION_CONTROL: 21,
  CONTACT: 99,
};

const SPELLS = [
  {
    id: 2,
    title: "The Resume",
    type: "Enchantment",
    cost: "2 R",
    rarity: "Rare",
    icon: "briefcase",
    color: "from-red-800 to-red-600",
    borderColor: "border-[#c0c0c0]",
    manaColor: "bg-red-200 text-red-900",
    stats: "",
    flavor: "SWE Intern @ FAST Enterprises • Data Analyst @ Amazon • Apple Specialist. \n1st Place PSPC, 2nd Place UHackathon, 7th Place ICPC. \nSkilled in Java, C#, Python, React, and RAG architectures.",
    effect: "Creatures you control get +5 to technical interviews and gain advantage on architecture rolls.\n\nTap this card while on the battlefield to reveal the full document."
  },
  {
    id: 3,
    title: "Portfolio Site",
    type: "Sorcery",
    cost: "1 U R",
    rarity: "Uncommon",
    icon: "code",
    color: "from-red-800 to-blue-800",
    borderColor: "border-[#718096]",
    manaColor: "bg-gradient-to-br from-blue-500 to-red-500 text-white",
    stats: "",
    flavor: "Artifact 1. An interactive, TCG-style React portfolio built to showcase quarter projects.",
    effect: "Draw a card. Reveal your hand to the opponent. They must acknowledge your superior UI/UX design skills."
  },
  {
    id: 4,
    title: "EV Optimizer",
    type: "Artifact — Vehicle",
    cost: "4",
    rarity: "Common",
    icon: "activity",
    color: "from-stone-500 to-stone-700",
    borderColor: "border-[#000000]",
    manaColor: "bg-stone-400 text-slate-800",
    stats: "4/4",
    flavor: "Artifact 2. A web tool to calculate real-world battery range and optimize charging schedules for an AWD electric vehicle.",
    effect: "Crew 2 (Tap any number of creatures you control with total power 2 or more: This Vehicle becomes an artifact creature until end of turn.)"
  },
  {
    id: 5,
    title: "Board State Analyzer",
    type: "Enchantment",
    cost: "2 W U B R G",
    rarity: "Mythic",
    icon: "brain",
    color: "from-purple-900 to-indigo-600",
    borderColor: "border-[#D4AF37]",
    manaColor: "bg-gradient-to-r from-amber-200 via-purple-300 to-red-300 text-slate-900",
    stats: "",
    flavor: "Artifact 3. An AI-powered tool for Magic: The Gathering that evaluates complex board states and suggests optimal plays or powerful synergies.",
    effect: "If Rosie Choi and The Resume are on the battlefield alongside this card, your Portfolio Site might just yield the ultimate synergy."
  },
  {
    id: 6,
    title: "Document Organizer",
    type: "Artifact",
    cost: "2 W",
    rarity: "Uncommon",
    icon: "book",
    color: "from-amber-100 to-white",
    borderColor: "border-[#718096]",
    manaColor: "bg-amber-100 text-slate-800",
    stats: "",
    flavor: "Artifact 4. A streamlined, highly accessible web interface to help elderly family members track and organize tax forms and wire transfer receipts.",
    effect: "T: Add one mana of any color. Spend this mana only to cast accessibility spells."
  },
  {
    id: 7,
    title: "K-Beauty Matcher",
    type: "Legendary Artifact",
    cost: "3 G",
    rarity: "Rare",
    icon: "sparkles",
    color: "from-green-600 to-emerald-900",
    borderColor: "border-[#c0c0c0]",
    manaColor: "bg-green-200 text-green-900",
    stats: "",
    flavor: "Artifact 5. A computer vision tool that analyzes skin undertones to recommend accurate base foundation matches across brands.",
    effect: "Whenever a creature enters the battlefield under your control, put a +1/+1 counter on it and it gains hexproof until end of turn."
  },
  {
    id: 8,
    title: "Orianna",
    actualName: "Helpful Hunter",
    type: "Creature — Cat",
    cost: "1 W",
    rarity: "Uncommon",
    icon: null, // Using image instead
    image: "orianna.jpg",
    color: "from-stone-200 to-white",
    borderColor: "border-[#718096]",
    manaColor: "bg-stone-200 text-slate-800",
    stats: "1/1",
    flavor: "This is Orianna, my little fur baby!",
    effect: "When this creature enters the battlefield, draw a card."
  },
  {
    id: 9,
    title: "My Hobbies",
    actualName: "Infernal Grasp",
    type: "Instant",
    cost: "1 B",
    rarity: "Uncommon",
    icon: "flame",
    color: "from-stone-800 to-black",
    borderColor: "border-[#718096]",
    manaColor: "bg-stone-400 text-black",
    stats: "",
    flavor: "Including Magic: The Gathering, playing with my cat, playing PC games with friends online, and socializing and networking with others.",
    effect: "Destroy target creature. You lose 2 life."
  },
  {
    id: 21,
    title: "Version Control",
    actualName: "Regrowth",
    type: "Sorcery",
    cost: "1 G",
    rarity: "Uncommon",
    icon: "tree",
    color: "from-green-700 to-emerald-900",
    borderColor: "border-[#718096]",
    manaColor: "bg-green-200 text-green-900",
    stats: "",
    flavor: "A seasoned developer never loses work. They just fetch it from the repository.",
    effect: "Return target card from your graveyard to your hand."
  },
  {
    id: 99,
    title: "Let's Connect!",
    type: "Sorcery",
    cost: "0",
    rarity: "Mythic",
    icon: "mail",
    color: "from-amber-400 via-yellow-300 to-amber-500",
    borderColor: "border-[#D4AF37]",
    manaColor: "bg-white text-black",
    stats: "",
    flavor: "The synergy is complete. The board is yours. Now, let's build something amazing together.",
    effect: "You win the game. (Play this card to open my contact form and claim your victory!)"
  }
];

const OMNISCIENCE = {
  id: 10,
  title: "Omniscience",
  type: "Enchantment",
  cost: "7 U U U",
  rarity: "Mythic",
  icon: "brain",
  color: "from-blue-700 to-cyan-500",
  borderColor: "border-[#D4AF37]",
  manaColor: "bg-blue-100 text-blue-900",
  stats: "",
  flavor: "The culmination of a rigorous computer science education: the sudden, terrifying realization that you can build anything.",
  effect: "You may cast spells from your hand without paying their mana costs."
};

const LAND_DEFS = [
  { id: 11, name: "Plains", mana: "W", icon: "sun", color: "from-yellow-100 to-amber-50", manaColor: "bg-white text-black" },
  { id: 12, name: "Plains", mana: "W", icon: "sun", color: "from-yellow-100 to-amber-50", manaColor: "bg-white text-black" },
  { id: 13, name: "Island", mana: "U", icon: "drop", color: "from-blue-500 to-blue-200", manaColor: "bg-blue-100 text-blue-900" },
  { id: 14, name: "Island", mana: "U", icon: "drop", color: "from-blue-500 to-blue-200", manaColor: "bg-blue-100 text-blue-900" },
  { id: 15, name: "Swamp", mana: "B", icon: "skull", color: "from-purple-900 to-stone-800", manaColor: "bg-stone-300 text-black" },
  { id: 16, name: "Swamp", mana: "B", icon: "skull", color: "from-purple-900 to-stone-800", manaColor: "bg-stone-300 text-black" },
  { id: 17, name: "Mountain", mana: "R", icon: "flame", color: "from-red-600 to-orange-500", manaColor: "bg-red-200 text-red-900" },
  { id: 18, name: "Mountain", mana: "R", icon: "flame", color: "from-red-600 to-orange-500", manaColor: "bg-red-200 text-red-900" },
  { id: 19, name: "Forest", mana: "G", icon: "tree", color: "from-green-600 to-emerald-400", manaColor: "bg-green-200 text-green-900" },
  { id: 20, name: "Forest", mana: "G", icon: "tree", color: "from-green-600 to-emerald-400", manaColor: "bg-green-200 text-green-900" }
];

export const LAND_IDS = LAND_DEFS.map(l => l.id);

const LANDS = LAND_DEFS.map(l => ({
  id: l.id,
  title: l.name,
  type: `Basic Land — ${l.name}`,
  cost: "",
  rarity: "Basic Land",
  icon: l.icon,
  color: l.color,
  borderColor: "border-[#111]",
  manaColor: l.manaColor,
  stats: "",
  flavor: "",
  effect: `T: Add ${l.mana}.`
}));

export const CARDS = [...SPELLS, OMNISCIENCE, ...LANDS];

export const getCardById = (id) =>
  id === COMMANDER_CARD.id ? COMMANDER_CARD : CARDS.find(c => c.id === id);
