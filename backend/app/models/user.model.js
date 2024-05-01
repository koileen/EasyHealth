const mongoose = require("mongoose");

const User = mongoose.model(
  "users",
  new mongoose.Schema({
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
    roles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      },
    files: [
        {
          filename: String,
          fileId: mongoose.Schema.Types.ObjectId,
        },
      ],
  },
)
);

module.exports = User;