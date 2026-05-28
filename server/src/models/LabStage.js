import mongoose from "mongoose";

const hintSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    cost: { type: Number, default: 0, min: 0 },
    level: { type: String, enum: ["subtle", "guided", "direct"], default: "subtle" }
  },
  { _id: true }
);

const labStageSchema = new mongoose.Schema(
  {
    lab: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    objectives: [{ type: String }],
    points: { type: Number, default: 100, min: 0 },
    order: { type: Number, required: true, index: true },
    stageType: {
      type: String,
      enum: ["recon", "exploitation", "privilege_escalation", "persistence", "reporting"],
      default: "recon",
      index: true
    },
    hints: [hintSchema],
    walkthrough: { type: String, default: "" },
    expectedFlags: [{ type: String }],
    completionCriteria: { type: mongoose.Schema.Types.Mixed, default: {} },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

labStageSchema.index({ lab: 1, order: 1 });

export const LabStage = mongoose.model("LabStage", labStageSchema);
