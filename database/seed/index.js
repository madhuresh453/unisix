import dotenv from "dotenv";
import mongoose from "mongoose";
import { usersSeed } from "./users.seed.js";
import { ctfSeed } from "./ctf.seed.js";
import { challengesSeed } from "./challenges.seed.js";
import { coursesSeed, labsSeed, roomsSeed, workshopsSeed } from "./learning.seed.js";
import { env } from "../../server/src/config/env.js";
import { CTF } from "../../server/src/models/CTF.js";
import { Challenge } from "../../server/src/models/Challenge.js";
import { Sponsor } from "../../server/src/models/Sponsor.js";
import { Submission } from "../../server/src/models/Submission.js";
import { Team } from "../../server/src/models/Team.js";
import { User } from "../../server/src/models/User.js";
import { Writeup } from "../../server/src/models/Writeup.js";
import { Lab } from "../../server/src/models/Lab.js";
import { Room } from "../../server/src/models/Room.js";
import { Course } from "../../server/src/models/Course.js";
import { Workshop } from "../../server/src/models/Workshop.js";
import { Enrollment } from "../../server/src/models/Enrollment.js";
import { Purchase } from "../../server/src/models/Purchase.js";
import { Media } from "../../server/src/models/Media.js";
import { Subscription } from "../../server/src/models/Subscription.js";
import { Certificate } from "../../server/src/models/Certificate.js";
import { createFlagHash } from "../../server/src/services/scoringService.js";

dotenv.config();

async function seed() {
  await mongoose.connect(env.mongoUri);

  await Promise.all([
    Challenge.deleteMany({}),
    CTF.deleteMany({}),
    Sponsor.deleteMany({}),
    Submission.deleteMany({}),
    Team.deleteMany({}),
    User.deleteMany({}),
    Writeup.deleteMany({}),
    Lab.deleteMany({}),
    Room.deleteMany({}),
    Course.deleteMany({}),
    Workshop.deleteMany({}),
    Enrollment.deleteMany({}),
    Purchase.deleteMany({}),
    Media.deleteMany({}),
    Subscription.deleteMany({}),
    Certificate.deleteMany({})
  ]);

  const users = await User.create(usersSeed);
  const admin = users.find((user) => user.role === "super_admin" || user.role === "admin");

  const team = await Team.create({
    name: "Nullsec Labs",
    slug: "nullsec-labs",
    captain: users[1]._id,
    members: [users[1]._id, users[2]._id],
    country: "IN",
    score: 9280,
    points: 1820
  });

  await User.updateMany({ _id: { $in: [users[1]._id, users[2]._id] } }, { $set: { team: team._id } });

  const ctfs = await CTF.insertMany(ctfSeed.map((ctf) => ({ ...ctf, createdBy: admin._id })));
  const liveCtf = ctfs.find((ctf) => ctf.slug === "redline-2026");

  const challenges = await Challenge.insertMany(
    challengesSeed.map((challenge) => {
      const { flagHash, flagSalt } = createFlagHash(challenge.flag);
      const { flag, ...safeChallenge } = challenge;

      return {
        ...safeChallenge,
        ctf: liveCtf._id,
        currentPoints: challenge.basePoints,
        flagHash,
        flagSalt
      };
    })
  );

  await CTF.updateOne(
    { _id: liveCtf._id },
    {
      $set: {
        challenges: challenges.map((challenge) => challenge._id),
        participants: users.slice(1).map((user) => user._id),
        teams: [team._id]
      }
    }
  );

  await Writeup.create([
    {
      title: "Shadow Login: Cache Poisoning to Admin",
      slug: "shadow-login-cache-poisoning",
      excerpt: "Abusing cache state and server-side authorization confusion in an SSO flow.",
      content:
        "The vulnerable profile endpoint cached user-specific state on a shared path. By carefully shaping the request headers, the admin route consumed a response that carried the wrong role. The fix is to remove personalized responses from shared caches and centralize authorization checks.",
      category: "Web",
      tags: ["web", "cache", "auth"],
      author: users[1]._id,
      challenge: challenges[0]._id,
      ctf: liveCtf._id,
      status: "published",
      publishedAt: new Date("2026-04-28T10:00:00.000Z")
    }
  ]);

  await Sponsor.insertMany([
    { name: "NOVA Labs", tier: "platinum", website: "https://example.com", weight: 100 },
    { name: "RedGrid", tier: "gold", website: "https://example.com", weight: 80 },
    { name: "CipherCloud", tier: "silver", website: "https://example.com", weight: 60 }
  ]);

  const labs = await Lab.insertMany(labsSeed.map((lab) => ({ ...lab, createdBy: admin._id })));
  const rooms = await Room.insertMany(roomsSeed.map((room, index) => ({ ...room, labs: labs.slice(index % 4, (index % 4) + 3).map((lab) => lab._id), createdBy: admin._id })));
  const courses = await Course.insertMany(coursesSeed.map((course) => ({ ...course, instructor: admin._id, createdBy: admin._id })));
  const workshops = await Workshop.insertMany(workshopsSeed.map((workshop) => ({ ...workshop, instructor: admin._id, createdBy: admin._id })));

  await User.updateOne(
    { _id: users[1]._id },
    {
      $set: {
        subscriptionPlan: "premium",
        xp: 6420,
        level: 18,
        rank: "Red Team Operator",
        streaks: { login: 14, learning: 9, challenge: 5, workshop: 2 }
      }
    }
  );

  const learningUsers = users.slice(1);
  const enrollmentRows = [
    ...labs.slice(0, 8).map((lab, index) => ({
      userId: learningUsers[index % learningUsers.length]._id,
      contentType: "lab",
      contentId: lab._id,
      progress: index % 3 === 0 ? 100 : 30 + index * 7,
      completed: index % 3 === 0,
      certificateIssued: false,
      bookmarks: index % 2 === 0 ? [`${lab.slug}:payload-notes`, `${lab.slug}:remediation`] : [],
      notes: [`Key takeaway for ${lab.title}: document impact before exploitation depth.`],
      lastViewedAt: new Date(Date.now() - index * 86400000)
    })),
    ...rooms.slice(0, 5).map((room, index) => ({
      userId: learningUsers[(index + 1) % learningUsers.length]._id,
      contentType: "room",
      contentId: room._id,
      progress: index === 0 ? 100 : 45 + index * 8,
      completed: index === 0,
      bookmarks: index % 2 ? ["walkthrough:checkpoint"] : [],
      notes: [`Room progress note for ${room.title}.`],
      lastViewedAt: new Date(Date.now() - (index + 2) * 86400000)
    })),
    ...courses.slice(0, 6).map((course, index) => ({
      userId: learningUsers[index % learningUsers.length]._id,
      contentType: "course",
      contentId: course._id,
      progress: index < 2 ? 100 : 25 + index * 10,
      completed: index < 2,
      certificateIssued: index < 2,
      bookmarks: index % 2 === 0 ? ["module-1", "capstone-brief"] : [],
      notes: [`Continue ${course.title} from the current module review.`],
      lastViewedAt: new Date(Date.now() - (index + 1) * 43200000)
    })),
    ...workshops.slice(0, 4).map((workshop, index) => ({
      userId: learningUsers[index % learningUsers.length]._id,
      contentType: "workshop",
      contentId: workshop._id,
      progress: index === 3 ? 100 : 15,
      completed: index === 3,
      certificateIssued: index === 3,
      bookmarks: ["session-brief"],
      notes: [`Registered for ${workshop.title}.`],
      lastViewedAt: new Date(Date.now() - index * 3600000)
    }))
  ];

  await Enrollment.insertMany(enrollmentRows);

  await Purchase.insertMany([
    { userId: users[1]._id, itemType: "subscription", amount: 4999, paymentStatus: "paid", transactionId: "demo_txn_premium_001", unlockedAt: new Date(), provider: "manual", metadata: { plan: "premium annual", source: "seed" } },
    { userId: users[1]._id, itemType: "course", itemId: courses[1]._id, amount: 1999, paymentStatus: "paid", transactionId: "demo_txn_course_ad_001", unlockedAt: new Date(), provider: "manual", metadata: { offerApplied: "50% OFF" } },
    { userId: users[2]._id, itemType: "lab", itemId: labs[4]._id, amount: 1499, paymentStatus: "paid", transactionId: "demo_txn_lab_bof_001", unlockedAt: new Date(), provider: "manual", metadata: { offerApplied: "50% OFF" } },
    { userId: users[3]._id, itemType: "workshop", itemId: workshops[2]._id, amount: 499, paymentStatus: "paid", transactionId: "demo_txn_workshop_soc_001", unlockedAt: new Date(), provider: "manual", metadata: { offerApplied: "early-bird" } }
  ]);

  await Subscription.insertMany([
    {
      userId: users[1]._id,
      plan: "premium",
      status: "active",
      provider: "manual",
      providerSubscriptionId: "demo_sub_premium_001",
      startedAt: new Date("2026-05-01T00:00:00.000Z"),
      expiresAt: new Date("2027-05-01T00:00:00.000Z"),
      features: ["premium_access", "certificates", "workshop_replays", "priority_labs"]
    },
    {
      userId: users[2]._id,
      plan: "pro",
      status: "trialing",
      provider: "manual",
      providerSubscriptionId: "demo_sub_trial_001",
      startedAt: new Date("2026-05-20T00:00:00.000Z"),
      expiresAt: new Date("2026-06-20T00:00:00.000Z"),
      features: ["premium_access", "certificates"]
    }
  ]);

  await Certificate.insertMany([
    {
      userId: users[1]._id,
      courseId: courses[0]._id,
      certificateId: "UNI6-DEMO-WEB-0001",
      issuedAt: new Date("2026-05-18T10:00:00.000Z"),
      downloadablePdf: "/demo/certificates/UNI6-DEMO-WEB-0001.pdf",
      verificationCode: "verify-web-0001"
    },
    {
      userId: users[2]._id,
      courseId: courses[2]._id,
      certificateId: "UNI6-DEMO-API-0002",
      issuedAt: new Date("2026-05-22T10:00:00.000Z"),
      downloadablePdf: "/demo/certificates/UNI6-DEMO-API-0002.pdf",
      verificationCode: "verify-api-0002"
    },
    {
      userId: users[3]._id,
      workshopId: workshops[9]._id,
      certificateId: "UNI6-DEMO-HUNT-0003",
      issuedAt: new Date("2026-05-21T10:00:00.000Z"),
      downloadablePdf: "/demo/certificates/UNI6-DEMO-HUNT-0003.pdf",
      verificationCode: "verify-hunt-0003"
    }
  ]);

  await Media.insertMany([
    { filename: "sql-injection-fundamentals.webp", originalName: "SQL Injection Fundamentals Thumbnail", mimeType: "image/webp", size: 148000, url: "/demo/academy/labs/sql-injection-fundamentals.webp", assetType: "thumbnail", contentType: "lab", contentId: labs[0]._id, uploadedBy: admin._id },
    { filename: "complete-web-pentesting.pdf", originalName: "Complete Web Pentesting Playbook", mimeType: "application/pdf", size: 840000, url: "/demo/resources/complete-web-pentesting-playbook.pdf", assetType: "pdf", contentType: "course", contentId: courses[0]._id, uploadedBy: admin._id },
    { filename: "live-red-team-simulation.webp", originalName: "Live Red Team Workshop Poster", mimeType: "image/webp", size: 220000, url: "/demo/academy/workshops/live-red-team-simulation.webp", assetType: "workshop_asset", contentType: "workshop", contentId: workshops[0]._id, uploadedBy: admin._id }
  ]);

  console.log("UNI6CTF seed complete");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
