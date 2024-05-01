const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

var corsOptions = {
    origin: "*"
  };

app.use(cors(corsOptions));
const Role = db.role;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((error) => console.error('Connection error', error));

  async function initial() {
    try {
      const count = await Role.countDocuments();
      if (count === 0) {
        await Promise.all([
          new Role({ name: "patient" }).save(),
          new Role({ name: "medical_personnel" }).save(),
          new Role({ name: "admin" }).save()
        ]);
        console.log("Roles initialized successfully.");
      } else {
        console.log("Roles already exist.");
      }
    } catch (err) {
      console.error("Error initializing roles:", err);
    }
  }

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});