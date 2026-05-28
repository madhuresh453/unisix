import mongoose from "mongoose";

const solveSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    ctf: { type: mongoose.Schema.Types.ObjectId, ref: "CTF" },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
    submission: { type: mongoose.Schema.Types.ObjectId, ref: "Submission" },
    pointsAwarded: { type: Number, default: 0 },
    firstBlood: { type: Boolean, default: false }
  },
  { timestamps: true }
);

solveSchema.index({ challenge: 1, createdAt: 1 });
solveSchema.index({ user: 1, challenge: 1 }, { unique: true });

export const Solve = mongoose.model("Solve", solveSchema);
