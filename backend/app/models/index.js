const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.med = require("./doctor.model");
db.loc = require("./location.model");
db.sched = require("./schedule.model");
db.appoint = require("./appointment.model");
// db.file = require("./appointment.model");
db.ROLES = ["patient", "medical_personnel", "unverified_med", "admin"];

module.exports = db;