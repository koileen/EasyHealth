const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
      type: String,
      required: true,
    },
  birthday: {
      type: Date,
      required: true,
    },
  email: {
      type: String,
      required: true,
      unique: true,
    },
  password: {
      type: String,
      required: true,
    },
  files: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "File"
  }],
  role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
}, { discriminatorKey: 'kind' }); // Add discriminator key

const User = mongoose.model("User", userSchema);

module.exports = User;