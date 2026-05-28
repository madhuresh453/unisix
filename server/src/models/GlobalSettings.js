import mongoose from "mongoose";

const globalSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true, index: true },
    footer: { type: mongoose.Schema.Types.Mixed, default: {} },
    socialLinks: { type: mongoose.Schema.Types.Mixed, default: {} },
    seo: { type: mongoose.Schema.Types.Mixed, default: {} },
    contact: { type: mongoose.Schema.Types.Mixed, default: {} },
    branding: { type: mongoose.Schema.Types.Mixed, default: {} },
    announcementBanner: { type: mongoose.Schema.Types.Mixed, default: {} },
    maintenanceMode: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const GlobalSettings = mongoose.model("GlobalSettings", globalSettingsSchema);
