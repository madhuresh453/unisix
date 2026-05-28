import mongoose from "mongoose";

const labSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    category: { type: String, default: "general", index: true },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced", "expert"], default: "beginner", index: true },
    tags: [{ type: String }],
    thumbnail: { type: String, default: "" },
    banner: { type: String, default: "" },
    premium: { type: Boolean, default: false, index: true },
    price: { type: Number, default: 0, min: 0 },
    visibility: { type: String, enum: ["public", "private", "unlisted"], default: "public", index: true },
    estimatedTime: { type: Number, default: 60 },
    objectives: [{ type: String }],
    prerequisites: [{ type: String }],
    downloadableFiles: [{ type: String }],
    dockerConfig: { type: mongoose.Schema.Types.Mixed, default: {} },
    vmConfig: { type: mongoose.Schema.Types.Mixed, default: {} },
    writeup: { type: String, default: "" },
    walkthrough: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    featured: { type: Boolean, default: false },
    activeUsers: { type: Number, default: 0 }
  },
  { timestamps: true }
);

labSchema.index({ featured: 1, createdAt: -1 });

export const Lab = mongoose.model("Lab", labSchema);
