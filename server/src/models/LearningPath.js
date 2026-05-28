import mongoose from "mongoose";

const learningPathSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, default: "" },
    category: { type: String, default: "general", index: true },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner", index: true },
    nodes: [
      {
        title: String,
        type: { type: String, enum: ["lab", "room", "course", "workshop", "milestone"], default: "milestone" },
        refId: { type: mongoose.Schema.Types.ObjectId, default: null },
        order: { type: Number, default: 0 },
        requires: [{ type: String }],
        xpReward: { type: Number, default: 0 }
      }
    ],
    premium: { type: Boolean, default: false, index: true },
    visibility: { type: String, enum: ["public", "private", "unlisted"], default: "public", index: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    featured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

learningPathSchema.index({ featured: 1, createdAt: -1 });

export const LearningPath = mongoose.model("LearningPath", learningPathSchema);
