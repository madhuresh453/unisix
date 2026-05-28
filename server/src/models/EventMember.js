import mongoose from "mongoose";

const eventMemberSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    ctfId: { type: mongoose.Schema.Types.ObjectId, ref: "CTFEvent", required: true, index: true },
    role: {
      type: String,
      enum: ["participant", "ctf_admin", "ctf_moderator", "challenge_author", "scoreboard_manager"],
      default: "participant"
    },
    permissions: [{ type: String }],
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

eventMemberSchema.index({ ctfId: 1, userId: 1 }, { unique: true });

export const EventMember = mongoose.model("EventMember", eventMemberSchema);
