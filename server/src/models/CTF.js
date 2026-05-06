import mongoose from "mongoose";

const ctfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["draft", "upcoming", "live", "past"], default: "draft" },
    format: { type: String, enum: ["Jeopardy", "Attack Defense", "King of the Hill"], default: "Jeopardy" },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    registrationClosesAt: Date,
    prize: String,
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Mixed"], default: "Mixed" },
    categories: [{ type: String }],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
    winners: [{ type: String }],
    rules: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

ctfSchema.index({ status: 1, startsAt: 1 });

export const CTF = mongoose.model("CTF", ctfSchema);
