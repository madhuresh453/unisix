export const ctfSeed = [
  {
    name: "UNI6 Redline CTF",
    slug: "redline-2026",
    description:
      "A 24-hour cybersecurity event covering web exploitation, cryptography, forensics, cloud, and binary exploitation.",
    status: "live",
    format: "Jeopardy",
    startsAt: new Date("2026-05-05T15:00:00.000Z"),
    endsAt: new Date("2026-05-06T15:00:00.000Z"),
    registrationClosesAt: new Date("2026-05-05T14:30:00.000Z"),
    prize: "$5,000",
    difficulty: "Intermediate",
    categories: ["Web", "Crypto", "Forensics", "Pwn", "Cloud"],
    rules: ["No flag sharing.", "No attacking infrastructure.", "Respect rate limits."]
  },
  {
    name: "Kernel Panic Finals",
    slug: "kernel-panic-finals",
    description:
      "Advanced attack-defense finals with service hardening, exploit writing, and operational scoring.",
    status: "upcoming",
    format: "Attack Defense",
    startsAt: new Date("2026-06-18T10:00:00.000Z"),
    endsAt: new Date("2026-06-19T10:00:00.000Z"),
    prize: "$10,000",
    difficulty: "Advanced",
    categories: ["Pwn", "Network", "Defense"]
  }
];
