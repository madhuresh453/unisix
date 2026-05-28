import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    itemType: { type: String, enum: ["lab", "room", "course", "workshop", "subscription"], required: true, index: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
    amount: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending", index: true },
    transactionId: { type: String, default: "", index: true },
    unlockedAt: Date,
    expiresAt: Date,
    provider: { type: String, enum: ["stripe", "razorpay", "manual"], default: "manual" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const Purchase = mongoose.model("Purchase", purchaseSchema);
