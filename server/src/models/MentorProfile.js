import mongoose from "mongoose";

const mentorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    avatar: { type: String, default: "" },
    headline: { type: String, default: "" },
    bio: { type: String, default: "" },
    certifications: [{ type: String }],
    social: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      website: { type: String, default: "" }
    },
    specialties: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workshop" }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    achievements: [{ type: String }],
    verified: { type: Boolean, default: false, index: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

mentorProfileSchema.index({ verified: 1, rating: -1 });

export const MentorProfile = mongoose.model("MentorProfile", mentorProfileSchema);
