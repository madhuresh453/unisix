import mongoose from "mongoose";

const attemptLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
    ctf: { type: mongoose.Schema.Types.ObjectId, ref: "CTF" },
    status: { type: String, enum: ["accepted", "rejected", "duplicate", "review"], required: true },
    ip: String,
    userAgent: String,
    riskScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

attemptLogSchema.index({ challenge: 1, createdAt: -1 });
attemptLogSchema.index({ user: 1, createdAt: -1 });

export const AttemptLog = mongoose.model("AttemptLog", attemptLogSchema);
