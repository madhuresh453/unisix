import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    sub: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    eyebrow: { type: String, default: "", trim: true },
    body: { type: String, default: "", trim: true },
    year: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sub: { type: String, default: "", trim: true },
    mark: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const homepageSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true, index: true },
    hero: {
      eyebrow: { type: String, default: "Capture the Flag" },
      titleLine1: { type: String, default: "Hack. Learn." },
      titleLine2: { type: String, default: "Compete. Grow." },
      description: { type: String, default: "" },
      imageUrl: { type: String, default: "/images/uni6ctf-hero.png" },
      primaryCtaText: { type: String, default: "Join Live CTF" },
      primaryCtaHref: { type: String, default: "/ctf/live" },
      secondaryCtaText: { type: String, default: "Explore Events" },
      secondaryCtaHref: { type: String, default: "/ctf" }
    },
    stats: [statSchema],
    featuredEventSlug: { type: String, default: "" },
    about: {
      label: { type: String, default: "|| About UNI6CTF" },
      title: { type: String, default: "Building The Future" },
      titleAccent: { type: String, default: "Of Cybersecurity" },
      description: { type: String, default: "" },
      ctaText: { type: String, default: "Read Our Story" },
      ctaHref: { type: String, default: "/about" }
    },
    achievements: [cardSchema],
    partners: [partnerSchema],
    announcements: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export const HomepageSettings = mongoose.model("HomepageSettings", homepageSettingsSchema);
