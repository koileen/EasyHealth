const express = require("express");
const cors = require("cors");
const path = require("path"); 
const db = require("./app/models");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

var corsOptions = {
    origin: "*"
  };

app.use(cors(corsOptions));
const Role = db.role;

// Serve static files from the 'test' directory
app.use(express.static(path.join(__dirname, "test")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "backend", "test", "home.html"));
});

// Serve the login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "backend", "test", "login.html"));
});

app.get("/user-signup", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "backend", "test", "user-signup.html"));
});

app.get("/med-signup", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "backend", "test", "med-signup.html"));
});

// app.get("/file-upload", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "backend", "test", "files-upload.html"));
// });



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
          new Role({ name: "admin" }).save(),
          new Role({ name: "unverified_med" }).save()
        ]);
        console.log("Roles initialized successfully.");
      } else {
        console.log("Roles already exist.");
      }
    } catch (err) {
      console.error("Error initializing roles:", err);
    }
  }

initial();

// routes
require('./app/routes/get.routes')(app);
require('./app/routes/post.routes')(app);
require('./app/routes/put.routes')(app);
require('./app/routes/delete.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});