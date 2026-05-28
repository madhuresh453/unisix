import mongoose from "mongoose";

const eventTeamSchema = new mongoose.Schema(
  {
    ctfId: { type: mongoose.Schema.Types.ObjectId, ref: "CTFEvent", required: true, index: true },
    name: { type: String, required: true, trim: true },
    captain: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    score: { type: Number, default: 0 },
    hidden: { type: Boolean, default: false },
    banned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

eventTeamSchema.index({ ctfId: 1, name: 1 }, { unique: true });
eventTeamSchema.index({ ctfId: 1, score: -1 });

export const EventTeam = mongoose.model("EventTeam", eventTeamSchema);
