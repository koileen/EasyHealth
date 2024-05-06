const mongoose = require("mongoose");
const User = require("./user.model");
const Schedule = require("./schedule.model");

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Scheduled", "Cancelled", "Completed", "Missed"],
        default: "Scheduled"
    }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;