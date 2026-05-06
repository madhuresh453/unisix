export const challengesSeed = [
  {
    title: "Shadow Login",
    slug: "shadow-login",
    description:
      "A hardened SSO panel leaks enough state through edge caching to make privilege escalation possible.",
    category: "Web",
    difficulty: "Medium",
    basePoints: 350,
    flag: "UNI6{cache_keys_are_auth_boundaries}",
    author: "UNI6 Labs",
    tags: ["cache", "auth", "web"],
    hints: [
      { title: "Cache key", body: "Compare authenticated and anonymous cache headers.", cost: 25 },
      { title: "Session shape", body: "The role is not where the application later reads it from.", cost: 50 }
    ],
    attachments: [{ name: "shadow-login.zip", url: "/downloads/shadow-login.zip" }],
    isPublished: true
  },
  {
    title: "Cold Wallet",
    slug: "cold-wallet",
    description:
      "A wallet recovery service signs predictable recovery transcripts. Recover the server key without brute force.",
    category: "Crypto",
    difficulty: "Hard",
    basePoints: 500,
    flag: "UNI6{never_reuse_signing_nonces}",
    author: "UNI6 Crypto",
    tags: ["ecdsa", "nonce", "crypto"],
    hints: [
      { title: "Nonce reuse", body: "Two signatures are closer than they should be.", cost: 40 },
      { title: "Curve order", body: "Normalize the modular arithmetic before solving.", cost: 75 }
    ],
    attachments: [{ name: "transcripts.txt", url: "/downloads/transcripts.txt" }],
    isPublished: true
  },
  {
    title: "Memory Splinter",
    slug: "memory-splinter",
    description:
      "A compromised workstation memory image contains a process injection trace and a recovered operator note.",
    category: "Forensics",
    difficulty: "Easy",
    basePoints: 180,
    flag: "UNI6{malfind_found_the_splinter}",
    author: "Blue UNI6",
    tags: ["memory", "volatility", "forensics"],
    hints: [
      { title: "Process tree", body: "Start from the browser child process with the unusual command line.", cost: 10 }
    ],
    attachments: [{ name: "splinter.mem.gz", url: "/downloads/splinter.mem.gz" }],
    isPublished: true
  }
];
