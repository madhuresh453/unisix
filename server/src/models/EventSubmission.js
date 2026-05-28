import mongoose from "mongoose";

const eventSubmissionSchema = new mongoose.Schema(
  {
    ctfId: { type: mongoose.Schema.Types.ObjectId, ref: "CTFEvent", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "EventTeam" },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "EventChallenge", required: true, index: true },
    submittedFlag: { type: String, required: true },
    status: { type: String, enum: ["correct", "wrong", "duplicate", "review"], required: true },
    ip: String,
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

eventSubmissionSchema.index({ ctfId: 1, createdAt: -1 });

export const EventSubmission = mongoose.model("EventSubmission", eventSubmissionSchema);
