import { Submission } from "../models/Submission.js";

export async function inspectSubmission({ user, challengeId, ip, flag }) {
  const reasons = [];
  let riskScore = 0;
  const since = new Date(Date.now() - 60 * 1000);

  const recentUserFailures = await Submission.countDocuments({
    user: user._id,
    challenge: challengeId,
    status: { $in: ["rejected", "review"] },
    createdAt: { $gte: since }
  });

  if (recentUserFailures >= 5) {
    riskScore += 45;
    reasons.push("High submission velocity for this challenge.");
  }

  const recentIpFailures = await Submission.countDocuments({
    ip,
    status: { $in: ["rejected", "review"] },
    createdAt: { $gte: since }
  });

  if (recentIpFailures >= 20) {
    riskScore += 35;
    reasons.push("High failed submission volume from IP.");
  }

  if (String(flag || "").length > 256) {
    riskScore += 30;
    reasons.push("Oversized flag payload.");
  }

  return {
    riskScore: Math.min(riskScore, 100),
    reasons
  };
}
