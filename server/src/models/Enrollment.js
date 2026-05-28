import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contentType: { type: String, enum: ["lab", "room", "course", "workshop"], required: true, index: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
    certificateIssued: { type: Boolean, default: false },
    bookmarks: [{ type: String }],
    notes: [{ type: String }],
    lastViewedAt: Date
  },
  { timestamps: true }
);

enrollmentSchema.index({ userId: 1, contentType: 1, contentId: 1 }, { unique: true });

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
