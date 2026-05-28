import mongoose from "mongoose";

const aboutSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true, index: true },
    missionCards: [{ type: mongoose.Schema.Types.Mixed }],
    timelineItems: [{ type: mongoose.Schema.Types.Mixed }],
    stats: [{ type: mongoose.Schema.Types.Mixed }],
    founder: {
      quote: { type: String, default: "" },
      name: { type: String, default: "" },
      title: { type: String, default: "" },
      org: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

export const AboutSettings = mongoose.model("AboutSettings", aboutSettingsSchema);
