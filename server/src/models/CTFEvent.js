import mongoose from "mongoose";

const ctfEventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    logo: { type: String, default: "" },
    banner: { type: String, default: "" },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    timezone: { type: String, default: "UTC" },
    visibility: { type: String, enum: ["public", "private", "unlisted"], default: "public" },
    status: { type: String, enum: ["draft", "upcoming", "live", "frozen", "ended", "archived"], default: "draft" },
    featured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
    theme: { type: mongoose.Schema.Types.Mixed, default: {} },
    rules: [{ type: String }],
    prizes: [{ type: String }],
    sponsors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sponsor" }],
    leaderboardVisibility: { type: String, enum: ["public", "participants", "hidden"], default: "public" },
    registrationOpen: { type: Boolean, default: true },
    maxTeamSize: { type: Number, default: 4, min: 1, max: 50 },
    allowedCountries: [{ type: String }],
    archived: { type: Boolean, default: false },
    freezeAt: Date,
    scoreboardSnapshotAt: Date
  },
  { timestamps: true }
);

ctfEventSchema.index({ status: 1, startTime: 1 });
ctfEventSchema.index({ featured: 1, startTime: -1 });

export const CTFEvent = mongoose.model("CTFEvent", ctfEventSchema);
