import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    size: { type: Number, default: 0 },
    url: { type: String, required: true, trim: true },
    publicId: { type: String, default: "" },
    assetType: { type: String, enum: ["thumbnail", "banner", "video", "pdf", "resource", "workshop_asset", "other"], default: "other", index: true },
    contentType: { type: String, enum: ["lab", "room", "course", "workshop", "global"], default: "global", index: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

mediaSchema.index({ createdAt: -1 });

export const Media = mongoose.model("Media", mediaSchema);
