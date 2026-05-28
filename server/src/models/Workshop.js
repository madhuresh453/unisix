import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    schedule: { type: Date },
    date: { type: Date },
    duration: { type: Number, default: 120 },
    seats: { type: Number, default: 100 },
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
    timezone: { type: String, default: "Asia/Kolkata" },
    mentor: {
      name: { type: String, default: "" },
      avatar: { type: String, default: "" },
      title: { type: String, default: "" },
      company: { type: String, default: "" }
    },
    meetingLink: { type: String, default: "" },
    meetingPlaceholder: { type: String, default: "" },
    recordings: [{ type: String }],
    replayEnabled: { type: Boolean, default: true },
    resources: [{ type: String }],
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    attendeeCount: { type: Number, default: 0, min: 0 },
    registeredUsers: { type: Number, default: 0, min: 0 },
    lifecycleStatus: { type: String, enum: ["live", "upcoming", "completed"], default: "upcoming", index: true },
    certificateEnabled: { type: Boolean, default: true },
    visibility: { type: String, enum: ["public", "private", "unlisted"], default: "public" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    description: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    banner: { type: String, default: "" },
    category: { type: String, default: "general", index: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }]
    },
    analytics: {
      views: { type: Number, default: 0 },
      registrations: { type: Number, default: 0 },
      attendanceRate: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

workshopSchema.index({ status: 1, visibility: 1, schedule: 1, premium: 1 });
workshopSchema.index({ featured: 1, createdAt: -1 });

export const Workshop = mongoose.model("Workshop", workshopSchema);
