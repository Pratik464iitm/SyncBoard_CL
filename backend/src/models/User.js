const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    isVerified: { type: Boolean, default: true }, // MVP: auto-verified, no email service wired up
    theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.methods.toSafeJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatarUrl: this.avatarUrl,
    isVerified: this.isVerified,
    theme: this.theme,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
