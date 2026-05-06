import mongoose from "mongoose";

const writeupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
    ctf: { type: mongoose.Schema.Types.ObjectId, ref: "CTF" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    views: { type: Number, default: 0 },
    publishedAt: Date
  },
  { timestamps: true }
);

writeupSchema.index({ status: 1, publishedAt: -1 });
writeupSchema.index({ title: "text", excerpt: "text", content: "text", tags: "text" });

export const Writeup = mongoose.model("Writeup", writeupSchema);
