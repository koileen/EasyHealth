const mongoose = require("mongoose");

const Location = mongoose.model(
  "Locations",
  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure unique location names
      },
  })
);

module.exports = Location;