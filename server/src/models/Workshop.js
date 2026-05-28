import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    schedule: { type: Date },
    duration: { type: Number, default: 120 },
    seats: { type: Number, default: 100 },
    premium: { type: Boolean, default: false, index: true },
    price: { type: Number, default: 0, min: 0 },
    meetingLink: { type: String, default: "" },
    recordings: [{ type: String }],
    resources: [{ type: String }],
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    certificateEnabled: { type: Boolean, default: true },
    visibility: { type: String, enum: ["public", "private", "unlisted"], default: "public" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    description: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    banner: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Workshop = mongoose.model("Workshop", workshopSchema);
