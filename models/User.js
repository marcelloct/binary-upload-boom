const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  photo: {
    type: String,
    default:
      "https://res.cloudinary.com/dsxfaroro/image/upload/v1765486472/default-avatar-icon-of-social-media-user-vector_tgl3mz.jpg",
  },
  password: String,
});

// PASSWORD HASH MIDDLEWARE (async)
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// COMPARE PASSWORD (async)
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
