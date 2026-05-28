import mongoose from "mongoose";

const eventNotificationSchema = new mongoose.Schema(
  {
    ctfId: { type: mongoose.Schema.Types.ObjectId, ref: "CTFEvent", required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["info", "warning", "success", "critical"], default: "info" },
    visible: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

eventNotificationSchema.index({ ctfId: 1, createdAt: -1 });

export const EventNotification = mongoose.model("EventNotification", eventNotificationSchema);
