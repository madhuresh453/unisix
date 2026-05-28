import mongoose from "mongoose";

const userNotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: [
        "xp_gained",
        "challenge_solved",
        "course_completed",
        "workshop_reminder",
        "subscription_update",
        "certificate_unlocked",
        "achievement_unlocked",
        "payment_success",
        "mentor_announcement",
        "admin_announcement"
      ],
      default: "admin_announcement",
      index: true
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    priority: { type: String, enum: ["low", "normal", "high", "critical"], default: "normal", index: true },
    readAt: Date,
    actionUrl: { type: String, default: "" },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    expiresAt: Date
  },
  { timestamps: true }
);

userNotificationSchema.index({ userId: 1, createdAt: -1 });
userNotificationSchema.index({ userId: 1, readAt: 1 });

export const UserNotification = mongoose.model("UserNotification", userNotificationSchema);
