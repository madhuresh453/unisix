import dotenv from "dotenv";
import mongoose from "mongoose";
import { usersSeed } from "./users.seed.js";
import { ctfSeed } from "./ctf.seed.js";
import { challengesSeed } from "./challenges.seed.js";
import { env } from "../../server/src/config/env.js";
import { CTF } from "../../server/src/models/CTF.js";
import { Challenge } from "../../server/src/models/Challenge.js";
import { Sponsor } from "../../server/src/models/Sponsor.js";
import { Submission } from "../../server/src/models/Submission.js";
import { Team } from "../../server/src/models/Team.js";
import { User } from "../../server/src/models/User.js";
import { Writeup } from "../../server/src/models/Writeup.js";
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
    Writeup.deleteMany({})
  ]);

  const users = await User.create(usersSeed);
  const admin = users.find((user) => user.role === "admin");

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

  console.log("UNI6CTF seed complete");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
