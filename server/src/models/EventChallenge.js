import mongoose from "mongoose";

const eventChallengeSchema = new mongoose.Schema(
  {
    ctfId: { type: mongoose.Schema.Types.ObjectId, ref: "CTFEvent", required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    points: { type: Number, default: 100, min: 1 },
    dynamicScoring: { type: Boolean, default: false },
    minPoints: { type: Number, default: 50 },
    maxPoints: { type: Number, default: 500 },
    visible: { type: Boolean, default: false },
    files: [{ type: mongoose.Schema.Types.Mixed }],
    hints: [{ type: mongoose.Schema.Types.Mixed }],
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    solves: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    flags: [{ type: mongoose.Schema.Types.Mixed }],
    dockerConfig: { type: mongoose.Schema.Types.Mixed, default: {} },
    downloadableFiles: [{ type: mongoose.Schema.Types.Mixed }],
    releaseAt: Date,
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

eventChallengeSchema.index({ ctfId: 1, slug: 1 }, { unique: true });
eventChallengeSchema.index({ ctfId: 1, visible: 1, order: 1 });

export const EventChallenge = mongoose.model("EventChallenge", eventChallengeSchema);
