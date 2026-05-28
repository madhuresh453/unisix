import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    rarity: { type: String, enum: ["common", "rare", "epic", "legendary"], default: "common" },
    xpReward: { type: Number, default: 0 },
    badgeIcon: { type: String, default: "" },
    criteria: { type: mongoose.Schema.Types.Mixed, default: {} },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Achievement = mongoose.model("Achievement", achievementSchema);
