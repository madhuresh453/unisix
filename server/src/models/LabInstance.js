import mongoose from "mongoose";

const labInstanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    lab: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true, index: true },
    status: {
      type: String,
      enum: ["pending", "deploying", "active", "resetting", "terminated", "expired", "failed"],
      default: "pending",
      index: true
    },
    assignedIp: { type: String, default: "" },
    vpnConfig: {
      fileName: { type: String, default: "" },
      content: { type: String, default: "" },
      lastDownloadedAt: { type: Date, default: null }
    },
    startedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null, index: true },
    durationMinutes: { type: Number, default: 60, min: 1 },
    resetCount: { type: Number, default: 0, min: 0 },
    environmentState: { type: mongoose.Schema.Types.Mixed, default: {} },
    containerId: { type: String, default: "" },
    region: { type: String, default: "" },
    difficulty: { type: String, default: "" },
    telemetry: { type: mongoose.Schema.Types.Mixed, default: {} },
    active: { type: Boolean, default: true, index: true },
    terminatedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

labInstanceSchema.index({ user: 1, lab: 1, status: 1, active: 1 });
labInstanceSchema.index({ expiresAt: 1 });

export const LabInstance = mongoose.model("LabInstance", labInstanceSchema);
