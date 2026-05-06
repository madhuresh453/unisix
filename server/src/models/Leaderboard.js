import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    scope: { type: String, enum: ["global", "team", "country", "event"], required: true },
    ctf: { type: mongoose.Schema.Types.ObjectId, ref: "CTF" },
    subjectType: { type: String, enum: ["User", "Team", "Country"], required: true },
    subjectId: { type: mongoose.Schema.Types.Mixed },
    displayName: { type: String, required: true },
    country: String,
    score: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    solves: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    lastSolveAt: Date
  },
  { timestamps: true }
);

leaderboardSchema.index({ scope: 1, ctf: 1, rank: 1 });
leaderboardSchema.index({ score: -1, updatedAt: 1 });

export const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
