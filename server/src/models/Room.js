import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    storyline: { type: String, default: "" },
    objectives: [{ type: String }],
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced", "expert"], default: "beginner", index: true },
    categories: [{ type: String }],
    premium: { type: Boolean, default: false, index: true },
    price: { type: Number, default: 0, min: 0 },
    offerPrice: { type: Number, default: 0, min: 0 },
    offerPercentage: { type: Number, default: 0, min: 0, max: 100 },
    offer: {
      enabled: { type: Boolean, default: false, index: true },
      label: { type: String, default: "" },
      startsAt: { type: Date, default: null },
      endsAt: { type: Date, default: null },
      featuredDeal: { type: Boolean, default: false },
      couponCompatible: { type: Boolean, default: true }
    },
    labs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lab" }],
    flags: [{
      key: { type: String, required: true },
      points: { type: Number, default: 100 }
    }],
    tasks: [{
      title: String,
      description: String,
      points: { type: Number, default: 25 }
    }],
    points: { type: Number, default: 0 },
    xpReward: { type: Number, default: 0 },
    hints: [{
      content: String,
      cost: { type: Number, default: 0 }
    }],
    walkthrough: { type: String, default: "" },
    progression: [{
      title: String,
      requiredTaskKeys: [{ type: String }],
      unlocks: [{ type: String }]
    }],
    roomType: { type: String, enum: ["attack-defense", "jeopardy", "guided", "mixed"], default: "guided" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    timeLimit: { type: Number, default: 0 },
    estimatedDuration: { type: Number, default: 120 },
    mentor: {
      name: { type: String, default: "" },
      avatar: { type: String, default: "" },
      title: { type: String, default: "" }
    },
    activeUsers: { type: Number, default: 0 },
    liveParticipantCount: { type: Number, default: 0 },
    participantCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    visibility: { type: String, enum: ["public", "private", "unlisted"], default: "public" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    featured: { type: Boolean, default: false },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }]
    },
    analytics: {
      views: { type: Number, default: 0 },
      starts: { type: Number, default: 0 },
      completions: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

roomSchema.index({ status: 1, visibility: 1, premium: 1, difficulty: 1 });
roomSchema.index({ featured: 1, createdAt: -1 });

export const Room = mongoose.model("Room", roomSchema);
