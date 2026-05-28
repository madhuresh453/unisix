import mongoose from "mongoose";

const labNoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    lab: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true, index: true },
    title: { type: String, default: "Untitled note" },
    content: { type: String, default: "" },
    bookmarks: [{ type: String }],
    payloads: [{ type: String }],
    pinned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

labNoteSchema.index({ user: 1, lab: 1 });

export const LabNote = mongoose.model("LabNote", labNoteSchema);
