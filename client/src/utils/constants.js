export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "CTF", href: "/ctf" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Writeups", href: "/writeups" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" }
];

export const stats = [
  { label: "CTFs hosted", value: "42", delta: "+8 this year" },
  { label: "Participants", value: "18.6K", delta: "from 64 universities" },
  { label: "Countries", value: "31", delta: "global community" },
  { label: "Challenges", value: "620+", delta: "web, crypto, pwn, forensics" }
];

export const events = [
  {
    id: "redline-2026",
    name: "UNI6 Redline CTF",
    status: "live",
    format: "Jeopardy",
    startsAt: "2026-05-05T15:00:00.000Z",
    endsAt: "2026-05-06T15:00:00.000Z",
    participants: 1482,
    teams: 268,
    prize: "$5,000",
    difficulty: "Intermediate",
    description:
      "A 24-hour university-grade cyber range covering web exploitation, cloud pivots, cryptanalysis, memory forensics, and reverse engineering.",
    categories: ["Web", "Crypto", "Forensics", "Pwn", "Cloud"],
    winners: ["nullsec labs", "ByteBreach", "Packet Pilots"]
  },
  {
    id: "kernel-panic-finals",
    name: "Kernel Panic Finals",
    status: "upcoming",
    format: "Attack Defense",
    startsAt: "2026-06-18T10:00:00.000Z",
    endsAt: "2026-06-19T10:00:00.000Z",
    participants: 860,
    teams: 96,
    prize: "$10,000",
    difficulty: "Advanced",
    description:
      "Final-stage attack defense with service hardening, exploit writing, network visibility, and incident response scoring.",
    categories: ["Pwn", "Network", "Defense"],
    winners: []
  },
  {
    id: "winter-hunt-2025",
    name: "Winter Hunt Invitational",
    status: "past",
    format: "Jeopardy",
    startsAt: "2025-12-08T08:00:00.000Z",
    endsAt: "2025-12-09T08:00:00.000Z",
    participants: 1188,
    teams: 211,
    prize: "$3,000",
    difficulty: "Mixed",
    description:
      "A mixed-difficulty event focused on real investigative workflows and practical exploitation.",
    categories: ["OSINT", "Forensics", "Web"],
    winners: ["Red Vectors", "0xCoffee", "Stack Smashers"]
  }
];

export const leaderboardRows = [
  { rank: 1, user: "nullsec labs", country: "IN", team: "Nullsec", score: 9280, points: 1820 },
  { rank: 2, user: "ByteBreach", country: "US", team: "BreachLab", score: 8870, points: 1710 },
  { rank: 3, user: "Packet Pilots", country: "DE", team: "Pilots", score: 8420, points: 1620 },
  { rank: 4, user: "Shell Syndicate", country: "SG", team: "Syndicate", score: 8030, points: 1535 },
  { rank: 5, user: "Cipherline", country: "BR", team: "Cipherline", score: 7640, points: 1440 },
  { rank: 6, user: "Overclocked", country: "JP", team: "OC", score: 7215, points: 1385 }
];

export const challenges = [
  {
    id: "shadow-login",
    title: "Shadow Login",
    category: "Web",
    difficulty: "Medium",
    points: 350,
    solves: 124,
    description:
      "A hardened single sign-on panel leaks enough state through edge caching to make privilege escalation possible.",
    author: "UNI6 Labs",
    attachments: ["shadow-login.zip"],
    hints: [
      { title: "Cache key", cost: 25, body: "Compare authenticated and anonymous cache headers." },
      { title: "Session shape", cost: 50, body: "The role is not where the application later reads it from." }
    ],
    discussions: [
      { author: "s0cket", body: "Do not ignore the vary header on the profile route.", time: "12m ago" },
      { author: "krait", body: "Solved after replaying the warm-cache request.", time: "34m ago" }
    ],
    solvers: ["nullsec labs", "ByteBreach", "Packet Pilots", "Cipherline"]
  },
  {
    id: "cold-wallet",
    title: "Cold Wallet",
    category: "Crypto",
    difficulty: "Hard",
    points: 500,
    solves: 48,
    description:
      "A wallet recovery service signs predictable recovery transcripts. Recover the server key without brute force.",
    author: "UNI6 Crypto",
    attachments: ["transcripts.txt"],
    hints: [
      { title: "Nonce reuse", cost: 40, body: "Two signatures are closer than they should be." },
      { title: "Curve order", cost: 75, body: "Normalize the modular arithmetic before solving." }
    ],
    discussions: [
      { author: "curvefit", body: "The transcript order matters.", time: "1h ago" }
    ],
    solvers: ["nullsec labs", "ByteBreach"]
  },
  {
    id: "memory-splinter",
    title: "Memory Splinter",
    category: "Forensics",
    difficulty: "Easy",
    points: 180,
    solves: 396,
    description:
      "A compromised workstation memory image contains a process injection trace and a recovered operator note.",
    author: "Blue UNI6",
    attachments: ["splinter.mem.gz"],
    hints: [
      { title: "Process tree", cost: 10, body: "Start from the browser child process with the unusual command line." }
    ],
    discussions: [
      { author: "memwalk", body: "Volatility malfind was enough for the first artifact.", time: "2h ago" }
    ],
    solvers: ["Packet Pilots", "Shell Syndicate", "Cipherline", "Overclocked"]
  }
];

export const writeups = [
  {
    slug: "shadow-login-cache-poisoning",
    title: "Shadow Login: Cache Poisoning to Admin",
    category: "Web",
    author: "Aarav Singh",
    readTime: "8 min",
    publishedAt: "2026-04-28",
    excerpt:
      "A practical breakdown of abusing edge cache state, session confusion, and privilege checks in a modern SSO flow.",
    tags: ["web", "cache", "auth"],
    content:
      "The challenge began with a profile endpoint that was cached differently depending on the request shape. By forcing a role-bearing response into a cache key shared by the admin route, the final request inherited elevated state. The safest fix is to remove user-specific data from shared cache paths and pin authorization to server-side session reads."
  },
  {
    slug: "cold-wallet-ecdsa-nonce-reuse",
    title: "Cold Wallet: ECDSA Nonce Reuse",
    category: "Crypto",
    author: "Mei Tan",
    readTime: "12 min",
    publishedAt: "2026-04-12",
    excerpt:
      "Recovering a private key from repeated signing nonce material in wallet recovery transcripts.",
    tags: ["crypto", "ecdsa", "math"],
    content:
      "Two recovery signatures exposed related nonce material. Once the order arithmetic was normalized, the private key fell out of the standard ECDSA equations. This writeup focuses on the reasoning path and the guardrails needed in signing services."
  },
  {
    slug: "memory-splinter-process-injection",
    title: "Memory Splinter: Process Injection Trail",
    category: "Forensics",
    author: "Lena Ortiz",
    readTime: "6 min",
    publishedAt: "2026-03-30",
    excerpt:
      "Walking a memory dump from suspicious process tree to injected payload and operator note recovery.",
    tags: ["forensics", "memory", "volatility"],
    content:
      "The evidence chain started with a browser child process that spawned a signed binary from a writable path. Memory scanning exposed shellcode and a dropped note. The lesson: process ancestry plus memory protection anomalies is still a fast forensic signal."
  }
];

export const achievements = [
  { title: "Top 20 CTFtime University Club", body: "Recognized for consistent event performance and community writeups." },
  { title: "64 Campus Chapters", body: "A distributed learning network across universities and security labs." },
  { title: "Responsible Disclosure Track", body: "Members have reported validated issues across public programs." }
];

export const partners = ["NOVA Labs", "RedGrid", "CipherCloud", "StackForge", "NullPoint", "PacketWorks"];

export const dashboardStats = [
  { label: "Total score", value: "8,920", detail: "+640 this month" },
  { label: "Solved", value: "126", detail: "18 first bloods" },
  { label: "Current rank", value: "#14", detail: "global leaderboard" },
  { label: "Badges", value: "22", detail: "4 elite badges" }
];

export const activity = [
  { event: "Solved Shadow Login", meta: "Web Medium, +350 pts", time: "10 minutes ago" },
  { event: "Unlocked hint on Cold Wallet", meta: "Crypto Hard, -40 pts", time: "42 minutes ago" },
  { event: "Team joined UNI6 Redline CTF", meta: "Packet Storm", time: "2 hours ago" },
  { event: "Published writeup draft", meta: "Memory Splinter", time: "Yesterday" }
];

export const submissions = [
  { challenge: "Shadow Login", status: "accepted", submittedAt: "20:14", points: 350 },
  { challenge: "Cold Wallet", status: "rejected", submittedAt: "19:51", points: 0 },
  { challenge: "Memory Splinter", status: "accepted", submittedAt: "18:08", points: 180 }
];

export const categories = ["All", "Web", "Crypto", "Forensics", "Pwn", "Cloud", "OSINT"];
