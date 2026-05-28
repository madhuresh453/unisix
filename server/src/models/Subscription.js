import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    plan: { type: String, enum: ["free", "premium", "pro", "enterprise"], default: "free", index: true },
    status: { type: String, enum: ["active", "trialing", "past_due", "cancelled", "expired"], default: "active", index: true },
    provider: { type: String, enum: ["stripe", "razorpay", "manual"], default: "manual" },
    providerSubscriptionId: { type: String, default: "" },
    startedAt: { type: Date, default: Date.now },
    expiresAt: Date,
    autoRenew: { type: Boolean, default: true },
    features: [{ type: String }]
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1, status: 1 });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
