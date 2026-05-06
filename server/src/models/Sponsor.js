import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logoUrl: String,
    website: String,
    tier: { type: String, enum: ["community", "silver", "gold", "platinum"], default: "community" },
    active: { type: Boolean, default: true },
    weight: { type: Number, default: 0 }
  },
  { timestamps: true }
);

sponsorSchema.index({ active: 1, weight: -1 });

export const Sponsor = mongoose.model("Sponsor", sponsorSchema);
