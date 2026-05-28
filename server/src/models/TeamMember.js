import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    badge: { type: String, default: "", trim: true },
    group: {
      type: String,
      enum: ["core", "developers", "researchers", "organizers"],
      required: true,
      index: true
    },
    socials: [{ type: mongoose.Schema.Types.Mixed }],
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

teamMemberSchema.index({ group: 1, active: 1, order: 1 });

export const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
