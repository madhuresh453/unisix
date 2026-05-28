import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    level: { type: String, enum: ["info", "success", "warning", "error"], default: "info" },
    audience: { type: String, enum: ["all", "admins", "users"], default: "all" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

notificationSchema.index({ active: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
