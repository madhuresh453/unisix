import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    storyline: { type: String, default: "" },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced", "expert"], default: "beginner", index: true },
    categories: [{ type: String }],
    premium: { type: Boolean, default: false, index: true },
    price: { type: Number, default: 0, min: 0 },
    labs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lab" }],
    flags: [{
      key: { type: String, required: true },
      points: { type: Number, default: 100 }
    }],
    tasks: [{
      title: String,
      description: String,
      points: { type: Number, default: 25 }
    }],
    points: { type: Number, default: 0 },
    hints: [{
      content: String,
      cost: { type: Number, default: 0 }
    }],
    walkthrough: { type: String, default: "" },
    roomType: { type: String, enum: ["attack-defense", "jeopardy", "guided", "mixed"], default: "guided" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    timeLimit: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    visibility: { type: String, enum: ["public", "private", "unlisted"], default: "public" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" }
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", roomSchema);
