const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true
    },
    dayOfWeek: [{
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Regular expression to validate the time format (HH:MM AM/PM)
                return /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(value);
            },
            message: props => `${props.value} is not a valid time format (HH:MM AM/PM)`
        }
    },
    endTime: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Regular expression to validate the time format (HH:MM AM/PM)
                return /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(value);
            },
            message: props => `${props.value} is not a valid time format (HH:MM AM/PM)`
        }
    },
    maxAppointments: {
        type: Number,
        required: true,
    }
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;