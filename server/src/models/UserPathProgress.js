import mongoose from "mongoose";

const userPathProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    pathId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningPath", required: true, index: true },
    completedNodes: [{ type: String }],
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
    mastery: {
      web: { type: Number, default: 0 },
      pwn: { type: Number, default: 0 },
      reverse: { type: Number, default: 0 },
      forensics: { type: Number, default: 0 },
      osint: { type: Number, default: 0 },
      cloud: { type: Number, default: 0 },
      blue: { type: Number, default: 0 }
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    preferredLearningStyle: { type: String, default: "mixed" }
  },
  { timestamps: true }
);

userPathProgressSchema.index({ userId: 1, pathId: 1 }, { unique: true });

export const UserPathProgress = mongoose.model("UserPathProgress", userPathProgressSchema);
