import mongoose from "mongoose";

const hintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    cost: { type: Number, default: 0 }
  },
  { _id: true }
);

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Web", "Crypto", "Forensics", "Pwn", "Reverse", "Cloud", "OSINT", "Misc"],
      required: true
    },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard", "Insane"], required: true },
    basePoints: { type: Number, required: true, min: 1 },
    currentPoints: { type: Number, required: true, min: 1 },
    flagHash: { type: String, required: true, select: false },
    flagSalt: { type: String, required: true, select: false },
    ctf: { type: mongoose.Schema.Types.ObjectId, ref: "CTF" },
    author: { type: String, default: "UNI6 Labs" },
    tags: [{ type: String }],
    hints: [hintSchema],
    attachments: [
      {
        name: String,
        url: String,
        checksum: String
      }
    ],
    dockerUrl: String,
    instanceUrl: String,
    flagType: { type: String, enum: ["static", "regex"], default: "static" },
    flagRegex: String,
    visibility: { type: String, enum: ["public", "private"], default: "public" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    scheduledReleaseAt: Date,
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    solves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    solverCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    discussionEnabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

challengeSchema.index({ ctf: 1, category: 1 });
challengeSchema.index({ currentPoints: -1 });

export const Challenge = mongoose.model("Challenge", challengeSchema);
