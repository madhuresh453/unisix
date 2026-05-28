import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", default: null },
    certificateId: { type: String, required: true, unique: true, index: true },
    issuedAt: { type: Date, default: Date.now },
    downloadablePdf: { type: String, default: "" },
    verificationCode: { type: String, required: true, index: true }
  },
  { timestamps: true }
);

export const Certificate = mongoose.model("Certificate", certificateSchema);
