import mongoose from "mongoose";

const labAssetSchema = new mongoose.Schema(
  {
    lab: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    assetType: {
      type: String,
      enum: ["pcap", "payload", "binary", "log", "script", "wordlist", "config", "report"],
      default: "binary",
      index: true
    },
    url: { type: String, required: true },
    fileName: { type: String, default: "" },
    mimeType: { type: String, default: "application/octet-stream" },
    size: { type: Number, default: 0, min: 0 },
    tags: [{ type: String }],
    premium: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    downloadCount: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

labAssetSchema.index({ lab: 1, assetType: 1 });

export const LabAsset = mongoose.model("LabAsset", labAssetSchema);
