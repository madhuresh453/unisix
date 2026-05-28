import mongoose from "mongoose";

const eventPageSchema = new mongoose.Schema(
  {
    ctfId: { type: mongoose.Schema.Types.ObjectId, ref: "CTFEvent", required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    content: { type: String, required: true },
    published: { type: Boolean, default: false },
    visibility: { type: String, enum: ["public", "participants", "admin"], default: "public" }
  },
  { timestamps: true }
);

eventPageSchema.index({ ctfId: 1, slug: 1 }, { unique: true });

export const EventPage = mongoose.model("EventPage", eventPageSchema);
