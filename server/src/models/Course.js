import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
    quizzes: [{ type: mongoose.Schema.Types.Mixed }],
    assignments: [{ type: mongoose.Schema.Types.Mixed }],
    premium: { type: Boolean, default: false, index: true },
    price: { type: Number, default: 0, min: 0 },
    duration: { type: Number, default: 0 },
    certificateEnabled: { type: Boolean, default: true },
    category: { type: String, default: "general", index: true },
    tags: [{ type: String }],
    rating: { type: Number, default: 0 },
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    visibility: { type: String, enum: ["public", "private", "unlisted"], default: "public" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    featured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
