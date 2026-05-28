import mongoose from "mongoose";

const eventConfigSchema = new mongoose.Schema(
  {
    ctfId: { type: mongoose.Schema.Types.ObjectId, ref: "CTFEvent", required: true, unique: true, index: true },
    eventName: { type: String, default: "" },
    logo: { type: String, default: "" },
    theme: { type: mongoose.Schema.Types.Mixed, default: {} },
    registrationEnabled: { type: Boolean, default: true },
    leaderboardEnabled: { type: Boolean, default: true },
    publicStats: { type: Boolean, default: true },
    visibility: { type: String, enum: ["public", "private"], default: "public" },
    emailTemplates: { type: mongoose.Schema.Types.Mixed, default: {} },
    countdownSettings: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const EventConfig = mongoose.model("EventConfig", eventConfigSchema);
