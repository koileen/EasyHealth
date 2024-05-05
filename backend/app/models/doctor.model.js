const mongoose = require("mongoose");
const User = require("./user.model");

const doctorSchema = new mongoose.Schema({
  profession: {
      type: String,
      required: true,
  },
  specializations: [{
      type: String,
      required: true,
  }],
  license: {
      type: String,
      required: true,
  },
  schedule: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule"
  }]
});

const Doctor = User.discriminator('Doctor', doctorSchema);

module.exports = Doctor;
