import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    captain: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    country: { type: String, default: "IN" },
    score: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    invites: [
      {
        email: String,
        token: String,
        expiresAt: Date
      }
    ]
  },
  { timestamps: true }
);

teamSchema.index({ score: -1 });

export const Team = mongoose.model("Team", teamSchema);
