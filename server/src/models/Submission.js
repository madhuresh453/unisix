import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    ctf: { type: mongoose.Schema.Types.ObjectId, ref: "CTF" },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
    flagPreview: { type: String },
    status: { type: String, enum: ["accepted", "rejected", "duplicate", "rate_limited", "review"], required: true },
    pointsAwarded: { type: Number, default: 0 },
    ip: String,
    userAgent: String,
    latencyMs: Number,
    antiCheat: {
      riskScore: { type: Number, default: 0 },
      reasons: [{ type: String }]
    }
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, challenge: 1, status: 1 });
submissionSchema.index({ ctf: 1, createdAt: -1 });
submissionSchema.index({ challenge: 1, status: 1 });

export const Submission = mongoose.model("Submission", submissionSchema);
