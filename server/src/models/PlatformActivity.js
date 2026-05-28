import mongoose from "mongoose";

const platformActivitySchema = new mongoose.Schema(
  {
    actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    action: { type: String, required: true, index: true },
    targetType: { type: String, enum: ["lab", "room", "course", "workshop", "challenge", "certificate", "payment", "team", "system"], default: "system", index: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
    text: { type: String, required: true },
    visibility: { type: String, enum: ["public", "private"], default: "public", index: true },
    priority: { type: String, enum: ["normal", "high"], default: "normal" },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

platformActivitySchema.index({ visibility: 1, createdAt: -1 });

export const PlatformActivity = mongoose.model("PlatformActivity", platformActivitySchema);
