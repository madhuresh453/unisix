import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    handle: { type: String, required: true, unique: true, trim: true, maxlength: 32 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["user", "captain", "admin"], default: "user" },
    country: { type: String, default: "IN" },
    bio: { type: String, default: "", maxlength: 320 },
    score: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    badges: [{ type: String }],
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    solvedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
    unlockedHints: [
      {
        challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
        hintId: String,
        cost: Number,
        unlockedAt: { type: Date, default: Date.now }
      }
    ],
    lastLoginAt: Date,
    profileCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.index({ score: -1 });

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model("User", userSchema);
