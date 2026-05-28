import mongoose from "mongoose";

const flagSubmissionSchema = new mongoose.Schema(
  {
    stage: { type: mongoose.Schema.Types.ObjectId, ref: "LabStage", required: true, index: true },
    flag: { type: String, required: true },
    correct: { type: Boolean, default: false },
    reward: { type: Number, default: 0, min: 0 },
    submittedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const hintUnlockSchema = new mongoose.Schema(
  {
    stage: { type: mongoose.Schema.Types.ObjectId, ref: "LabStage", required: true, index: true },
    hintId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    cost: { type: Number, default: 0, min: 0 },
    level: { type: String, enum: ["subtle", "guided", "direct"], default: "subtle" },
    unlockedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const completedStageSchema = new mongoose.Schema(
  {
    stage: { type: mongoose.Schema.Types.ObjectId, ref: "LabStage", required: true, index: true },
    completedAt: { type: Date, default: Date.now },
    xpEarned: { type: Number, default: 0, min: 0 },
    flags: [flagSubmissionSchema]
  },
  { _id: false }
);

const userLabProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    lab: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true, index: true },
    status: {
      type: String,
      enum: ["active", "paused", "completed", "reset", "archived"],
      default: "active",
      index: true
    },
    currentStage: { type: mongoose.Schema.Types.ObjectId, ref: "LabStage" },
    completedStages: [completedStageSchema],
    submittedFlags: [flagSubmissionSchema],
    unlockedHints: [hintUnlockSchema],
    timeSpent: { type: Number, default: 0, min: 0 },
    xpEarned: { type: Number, default: 0, min: 0 },
    resets: { type: Number, default: 0, min: 0 },
    achievements: [{ type: String }],
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "LabNote" }],
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

userLabProgressSchema.index({ user: 1, lab: 1 }, { unique: true });

export const UserLabProgress = mongoose.model("UserLabProgress", userLabProgressSchema);
