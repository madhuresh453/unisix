const asset = (type, slug) => `/demo/academy/${type}/${slug}.webp`;
const avatar = (slug) => `/demo/academy/avatars/${slug}.webp`;

const offerWindow = {
  startsAt: new Date("2026-05-01T00:00:00.000Z"),
  endsAt: new Date("2026-06-30T23:59:59.000Z")
};

function offer(price, offerPrice, label = "Limited academy offer") {
  const offerPercentage = price > 0 && offerPrice > 0 ? Math.round(((price - offerPrice) / price) * 100) : 0;
  return {
    price,
    offerPrice,
    offerPercentage,
    offer: {
      enabled: offerPercentage > 0,
      label,
      ...offerWindow,
      featuredDeal: offerPercentage >= 30,
      couponCompatible: true
    }
  };
}

function lab(entry, index) {
  const [title, slug, shortDescription, category, difficulty, tags, estimatedTime, xpReward, premium, price, offerPrice] = entry;
  const enrollments = 340 + index * 47;
  const completions = 120 + index * 19;
  const activeUsers = 18 + (index % 9) * 3;
  return {
    title,
    slug,
    shortDescription,
    fullDescription: `${shortDescription} This professional lab includes guided exploitation steps, defensive notes, evidence collection, and remediation guidance suitable for portfolio-grade reporting.`,
    description: shortDescription,
    category,
    difficulty,
    tags,
    objectives: [
      `Identify realistic ${category.toLowerCase()} attack paths.`,
      "Exploit the vulnerable workflow inside a controlled range.",
      "Collect evidence and write practical remediation guidance."
    ],
    prerequisites: ["Linux command line", "HTTP and networking basics", "Burp Suite or equivalent tooling"],
    estimatedTime,
    xpReward,
    premium,
    ...offer(price, offerPrice, "Lab launch deal"),
    thumbnail: asset("labs", slug),
    banner: asset("labs", `${slug}-banner`),
    featured: index < 6,
    status: "published",
    visibility: "public",
    enrolledCount: enrollments,
    completionStats: { started: enrollments, completed: completions, completionRate: Math.round((completions / enrollments) * 100) },
    activeUsers,
    analytics: {
      views: 1200 + index * 185,
      enrollments,
      starts: enrollments,
      completions,
      activeUsers,
      avgCompletionMinutes: Math.max(45, estimatedTime - 15)
    }
  };
}

export const labsSeed = [
  ["SQL Injection Fundamentals", "sql-injection-fundamentals", "Exploit login, search, and reporting flaws using error-based and blind SQL injection.", "Web Security", "beginner", ["sql", "web", "burp-suite"], 110, 450, false, 0, 0],
  ["SSRF Exploitation Lab", "ssrf-exploitation-lab", "Pivot server-side requests into metadata services, internal panels, and cloud credentials.", "Web Security", "intermediate", ["ssrf", "metadata", "cloud"], 130, 650, true, 1999, 999],
  ["Active Directory Recon", "active-directory-recon", "Enumerate domain users, groups, sessions, and attack paths with analyst-grade notes.", "Active Directory", "intermediate", ["ldap", "kerberos", "bloodhound"], 150, 700, true, 2499, 1499],
  ["Windows Privilege Escalation", "windows-privilege-escalation", "Escalate from low-privilege Windows access through services, registry, and credential leaks.", "Active Directory", "advanced", ["windows", "privesc", "services"], 180, 850, true, 2999, 1799],
  ["Linux Buffer Overflow", "linux-buffer-overflow", "Control execution flow in a vulnerable Linux binary with debugger-assisted exploit development.", "Binary Exploitation", "advanced", ["pwn", "gdb", "bof"], 190, 900, true, 2999, 1499],
  ["Malware Sandbox Analysis", "malware-sandbox-analysis", "Triage a suspicious Windows executable through static indicators and sandbox behavior.", "Malware Analysis", "advanced", ["malware", "sandbox", "ioc"], 160, 850, true, 3499, 1999],
  ["Docker Escape Fundamentals", "docker-escape-fundamentals", "Abuse exposed sockets, capabilities, and mounts to understand container escape risk.", "Cloud Security", "intermediate", ["docker", "containers", "linux"], 120, 600, false, 0, 0],
  ["AWS S3 Bucket Misconfiguration", "aws-s3-bucket-misconfiguration", "Discover exposed storage, validate impact, and write cloud storage remediation guidance.", "Cloud Security", "beginner", ["aws", "s3", "cloud"], 95, 500, false, 0, 0],
  ["Android APK Reverse Engineering", "android-apk-reverse-engineering", "Decompile an APK, inspect secrets, and reason about client-side trust boundaries.", "Mobile Security", "intermediate", ["android", "apk", "jadx"], 140, 700, true, 2299, 1299],
  ["API Authentication Bypass", "api-authentication-bypass", "Exploit weak API auth flows, object-level authorization, and token handling mistakes.", "API Security", "intermediate", ["api", "auth", "bola"], 135, 700, true, 2499, 1499],
  ["JWT Token Exploitation", "jwt-token-exploitation", "Analyze JWT signing mistakes, claim trust issues, and key confusion scenarios.", "API Security", "beginner", ["jwt", "api", "crypto"], 105, 500, false, 0, 0],
  ["OSINT Investigation Basics", "osint-investigation-basics", "Correlate public profiles, infrastructure clues, and breach data into a defensible report.", "OSINT", "beginner", ["osint", "intel", "reporting"], 90, 400, false, 0, 0],
  ["Cloud IAM Privilege Escalation", "cloud-iam-privilege-escalation", "Identify permissive cloud identities and chain privileges to controlled administrative impact.", "Cloud Security", "advanced", ["iam", "aws", "privilege-escalation"], 170, 900, true, 3499, 1999],
  ["Linux Kernel Exploitation", "linux-kernel-exploitation", "Study a vulnerable kernel module and build a safe local privilege escalation proof.", "Linux Privilege Escalation", "expert", ["linux", "kernel", "exploit-dev"], 220, 1100, true, 3999, 2499],
  ["Reverse Engineering CrackMe", "reverse-engineering-crackme", "Recover validation logic from a stripped binary and patch execution flow safely.", "Reverse Engineering", "intermediate", ["reversing", "ghidra", "crackme"], 145, 700, true, 1999, 999]
].map(lab);

function room(entry, index) {
  const [title, slug, storyline, difficulty, categories, premium, price, offerPrice] = entry;
  const participantCount = 280 + index * 53;
  const completionRate = 34 + (index % 8) * 5;
  return {
    title,
    slug,
    storyline,
    objectives: [
      "Follow a realistic investigation or attack chain.",
      "Submit evidence-backed flags across each phase.",
      "Complete a final executive-style summary."
    ],
    roomType: index % 3 === 0 ? "guided" : index % 3 === 1 ? "mixed" : "jeopardy",
    tasks: ["Recon", "Initial Access", "Privilege Path", "Impact Report"].map((task, taskIndex) => ({
      title: `${task} task`,
      description: `Complete the ${task.toLowerCase()} phase and attach the required proof.`,
      points: 100 + taskIndex * 50
    })),
    hints: [
      { content: "Start by mapping trust boundaries and exposed services.", cost: 25 },
      { content: "Look for identity, token, or configuration assumptions.", cost: 50 }
    ],
    walkthrough: `# ${title}\n\nUse the task flow to move from discovery to evidence collection. Keep notes suitable for a professional report.`,
    flags: [
      { key: `UNI6{${slug.replaceAll("-", "_")}_phase_1}`, points: 150 },
      { key: `UNI6{${slug.replaceAll("-", "_")}_complete}`, points: 350 }
    ],
    difficulty,
    xpReward: 900 + index * 110,
    points: 900 + index * 110,
    premium,
    ...offer(price, offerPrice, "Room bundle offer"),
    categories,
    estimatedDuration: 180 + index * 15,
    timeLimit: 0,
    mentor: { name: ["Maya Chen", "Aisha Rahman", "Oliver Hart", "Kavya Iyer"][index % 4], avatar: avatar(`mentor-${index % 4}`), title: "Lead Academy Mentor" },
    participantCount,
    liveParticipantCount: 22 + index * 3,
    activeUsers: 20 + index * 2,
    completionRate,
    featured: index < 5,
    status: "published",
    visibility: "public",
    analytics: { views: 1800 + index * 240, starts: participantCount, completions: Math.round(participantCount * completionRate / 100) }
  };
}

export const roomsSeed = [
  ["Web Pentesting Path", "web-pentesting-path", "A full web assessment path from recon to business-impact reporting.", "beginner", ["Web Security", "API Security"], false, 0, 0],
  ["Bug Bounty Starter", "bug-bounty-starter", "Learn target selection, recon, validation, and high-signal bounty reports.", "beginner", ["Bug Bounty", "Web Security"], false, 0, 0],
  ["SOC Analyst Simulation", "soc-analyst-simulation", "Triage alerts, enrich indicators, and escalate a realistic intrusion.", "beginner", ["SOC", "Forensics"], false, 0, 0],
  ["Malware Analysis Journey", "malware-analysis-journey", "Move from suspicious file to behavioral report and containment checklist.", "advanced", ["Malware Analysis", "Reverse Engineering"], true, 2999, 1499],
  ["Red Team Operations", "red-team-operations", "Operate through recon, foothold, privilege escalation, and reporting phases.", "advanced", ["Red Team", "Active Directory"], true, 3999, 2499],
  ["Active Directory Attack Chain", "active-directory-attack-chain", "Chain enumeration, Kerberos mistakes, and lateral movement in a domain lab.", "advanced", ["Active Directory"], true, 3499, 1999],
  ["Cloud Exploitation Path", "cloud-exploitation-path", "Exploit storage, identity, and workload mistakes in a simulated cloud tenant.", "intermediate", ["Cloud Security"], true, 3299, 1799],
  ["Blue Team Fundamentals", "blue-team-fundamentals", "Practice log review, incident classification, and containment decisions.", "beginner", ["SOC", "Forensics"], false, 0, 0],
  ["OSINT Investigator Room", "osint-investigator-room", "Build an attribution-confidence report from public sources and infrastructure traces.", "beginner", ["OSINT"], false, 0, 0],
  ["Linux Exploitation Path", "linux-exploitation-path", "Progress from local enumeration to userland and kernel privilege escalation.", "advanced", ["Linux Privilege Escalation", "Binary Exploitation"], true, 3499, 1999],
  ["Reverse Engineering Bootcamp", "reverse-engineering-bootcamp", "Analyze crackmes, unpack samples, and recover validation logic.", "intermediate", ["Reverse Engineering", "Malware Analysis"], true, 2499, 1499],
  ["API Security Attack Room", "api-security-attack-room", "Chain BOLA, broken auth, mass assignment, and weak token validation.", "intermediate", ["API Security", "Web Security"], true, 2999, 1499]
].map(room);

function course(entry, index) {
  const [title, slug, description, category, difficulty, instructorName, price, offerPrice, premium] = entry;
  const enrolledCount = 850 + index * 145;
  const completionRate = 38 + (index % 7) * 6;
  const downloadableResources = [`/demo/resources/${slug}-playbook.pdf`, `/demo/resources/${slug}-checklist.md`];
  return {
    title,
    slug,
    description,
    instructorName,
    instructorAvatar: avatar(slug),
    category,
    difficulty,
    tags: [category.toLowerCase(), difficulty, "certificate"],
    modules: ["Foundations", "Hands-on Practice", "Professional Workflow", "Capstone"].map((moduleTitle, moduleIndex) => ({
      title: moduleTitle,
      lessons: ["Briefing", "Guided Lab", "Review"].map((lessonTitle, lessonIndex) => ({
        title: `${lessonTitle}: ${category}`,
        type: lessonIndex === 1 ? "video" : "markdown",
        content: lessonIndex === 1 ? `/demo/videos/${slug}-${moduleIndex + 1}.mp4` : `# ${lessonTitle}\n\nApply ${category} methodology in a realistic scenario.`,
        duration: 30 + moduleIndex * 8 + lessonIndex * 12,
        preview: moduleIndex === 0 && lessonIndex === 0
      }))
    })),
    quizzes: [{ title: "Professional knowledge check", questions: 15, passingScore: 75 }],
    assignments: [{ title: "Capstone report submission", rubric: "Evidence quality, risk clarity, remediation accuracy" }],
    resources: downloadableResources,
    downloadableResources,
    duration: 480 + index * 65,
    rating: Number((4.5 + (index % 5) / 10).toFixed(1)),
    ratingCount: 220 + index * 51,
    enrolledCount,
    premium,
    ...offer(premium ? price : 0, premium ? offerPrice : 0, "Course launch discount"),
    thumbnail: asset("courses", slug),
    banner: asset("courses", `${slug}-banner`),
    featured: index < 5,
    certificateEnabled: true,
    completionRate,
    status: "published",
    visibility: "public",
    analytics: { views: 2600 + index * 320, enrollments: enrolledCount, completions: Math.round(enrolledCount * completionRate / 100), avgWatchMinutes: 260 + index * 22 }
  };
}

export const coursesSeed = [
  ["Complete Web Pentesting", "complete-web-pentesting", "Professional web assessment methodology from recon to final report.", "Web Security", "beginner", "Maya Chen", 0, 0, false],
  ["Practical Active Directory", "practical-active-directory", "Hands-on enterprise Windows attack paths, detection notes, and remediation.", "Active Directory", "advanced", "Oliver Hart", 3999, 1999, true],
  ["API Security Professional", "api-security-professional", "Modern API testing across auth, authorization, schema, and business logic.", "API Security", "intermediate", "Kavya Iyer", 2999, 1499, true],
  ["Malware Reverse Engineering", "malware-reverse-engineering", "Static and dynamic malware analysis for analysts and reverse engineers.", "Malware Analysis", "advanced", "Dr. Rafael Costa", 4499, 2499, true],
  ["Cloud Security Essentials", "cloud-security-essentials", "Practical IAM, storage, network, and workload security across cloud scenarios.", "Cloud Security", "intermediate", "Ethan Brooks", 3499, 1799, true],
  ["Bug Bounty Bootcamp", "bug-bounty-bootcamp", "Scope selection, recon, vuln validation, and high-signal bounty reporting.", "Web Security", "beginner", "Nora Weiss", 2499, 1299, true],
  ["Linux Exploitation Masterclass", "linux-exploitation-masterclass", "Userland exploitation, privilege escalation, and kernel risk fundamentals.", "Linux Privilege Escalation", "advanced", "Arjun Mehta", 3999, 2299, true],
  ["OSINT Professional Training", "osint-professional-training", "Source grading, identity correlation, infrastructure analysis, and reporting.", "OSINT", "beginner", "Lena Ortiz", 1999, 999, true],
  ["Reverse Engineering for Beginners", "reverse-engineering-for-beginners", "Binary analysis fundamentals with Ghidra, debugging, and patching practice.", "Reverse Engineering", "beginner", "Mei Tan", 1999, 999, true],
  ["SOC Analyst Career Path", "soc-analyst-career-path", "Alert triage, enrichment, timeline analysis, and incident communication.", "SOC", "beginner", "Aisha Rahman", 2999, 1499, true]
].map(course);

function workshop(entry, index) {
  const [title, slug, mentorName, schedule, duration, seats, price, offerPrice, premium, lifecycleStatus] = entry;
  const registeredUsers = Math.min(seats - 3, 28 + index * 9);
  return {
    mentor: { name: mentorName, avatar: avatar(slug), title: "Senior Security Mentor", company: "UNI6CTF Academy" },
    title,
    slug,
    description: `${title} with hands-on exercises, live Q&A, replay access, and certificate eligibility.`,
    date: new Date(schedule),
    schedule: new Date(schedule),
    timezone: "Asia/Kolkata",
    duration,
    seats,
    registeredUsers,
    attendeeCount: registeredUsers,
    lifecycleStatus,
    premium,
    ...offer(premium ? price : 0, premium ? offerPrice : 0, "Workshop early-bird"),
    replayEnabled: true,
    certificateEnabled: true,
    meetingPlaceholder: "Secure meeting link unlocks 2 hours before start.",
    resources: [`/demo/workshops/${slug}-brief.pdf`],
    banner: asset("workshops", `${slug}-banner`),
    thumbnail: asset("workshops", slug),
    featured: index < 5,
    category: index % 2 ? "Blue Team" : "Offensive Security",
    tags: ["live", "mentor-led", "certificate"],
    status: "published",
    visibility: "public",
    analytics: { views: 900 + index * 190, registrations: registeredUsers, attendanceRate: lifecycleStatus === "completed" ? 78 + (index % 10) : 0 }
  };
}

export const workshopsSeed = [
  ["Live Red Team Simulation", "live-red-team-simulation", "Maya Chen", "2026-06-08T14:00:00.000Z", 180, 120, 2999, 1499, true, "upcoming"],
  ["Malware Analysis Bootcamp", "malware-analysis-bootcamp", "Dr. Rafael Costa", "2026-06-12T16:00:00.000Z", 210, 90, 3499, 1999, true, "upcoming"],
  ["SOC Monitoring Workshop", "soc-monitoring-workshop", "Aisha Rahman", "2026-06-15T13:30:00.000Z", 150, 150, 999, 499, true, "upcoming"],
  ["OSINT Investigation Workshop", "osint-investigation-workshop", "Nora Weiss", "2026-06-19T15:00:00.000Z", 150, 110, 1499, 749, true, "upcoming"],
  ["Advanced Cloud Exploitation", "advanced-cloud-exploitation", "Ethan Brooks", "2026-06-22T17:00:00.000Z", 180, 100, 3499, 1799, true, "upcoming"],
  ["API Security Live Attack Session", "api-security-live-attack-session", "Kavya Iyer", "2026-06-26T14:30:00.000Z", 160, 130, 2499, 1249, true, "upcoming"],
  ["Linux PrivEsc Live Workshop", "linux-privesc-live-workshop", "Arjun Mehta", "2026-07-03T16:30:00.000Z", 180, 90, 2999, 1499, true, "upcoming"],
  ["Bug Bounty Practical Workshop", "bug-bounty-practical-workshop", "Nora Weiss", "2026-07-06T14:00:00.000Z", 150, 160, 999, 0, false, "upcoming"],
  ["Reverse Engineering Live Session", "reverse-engineering-live-session", "Mei Tan", "2026-07-10T13:00:00.000Z", 180, 100, 2499, 1249, true, "upcoming"],
  ["Threat Hunting Workshop", "threat-hunting-workshop", "Aisha Rahman", "2026-05-20T13:00:00.000Z", 150, 140, 1999, 999, true, "completed"]
].map(workshop);
