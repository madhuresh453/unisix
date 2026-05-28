import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    instructorName: { type: String, default: "" },
    instructorAvatar: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    banner: { type: String, default: "" },
    modules: [{
      title: String,
      lessons: [{
        title: String,
        type: { type: String, enum: ["video", "markdown", "quiz", "assignment"], default: "markdown" },
        content: { type: String, default: "" },
        duration: { type: Number, default: 0 },
        preview: { type: Boolean, default: false }
      }]
    }],
    resources: [{ type: String }],
    downloadableResources: [{ type: String }],
    quizzes: [{ type: mongoose.Schema.Types.Mixed }],
    assignments: [{ type: mongoose.Schema.Types.Mixed }],
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
    duration: { type: Number, default: 0 },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced", "expert"], default: "beginner", index: true },
    certificateEnabled: { type: Boolean, default: true },
    category: { type: String, default: "general", index: true },
    tags: [{ type: String }],
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    enrolledCount: { type: Number, default: 0, min: 0 },
    completionRate: { type: Number, default: 0 },
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    visibility: { type: String, enum: ["public", "private", "unlisted"], default: "public" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    featured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }]
    },
    analytics: {
      views: { type: Number, default: 0 },
      enrollments: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      avgWatchMinutes: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

courseSchema.index({ status: 1, visibility: 1, category: 1, premium: 1 });
courseSchema.index({ featured: 1, rating: -1, createdAt: -1 });

export const Course = mongoose.model("Course", courseSchema);
