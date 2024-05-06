// schedule.controller.js
const db = require("../models");
const Med = db.med;
const Loc = db.loc;
const Sched = db.sched;
const Appoint = db.appoint;
exports.addSchedule = async (req, res) => {
  try {
    const { locationName, dayOfWeek, startTime, endTime, maxAppointments } = req.body;
    const doctorId = req.userId;

    // Check if doctor exists
    const doctor = await Med.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Check if location exists, create new if necessary
    let location = await Loc.findOne({ name: locationName });
    if (!location) {
      location = new Loc({ name: locationName });
      location = await location.save();
    }

    // Check if the location already has a schedule for the same dayOfWeek
    const existingSchedule = await Sched.findOne({ location: location._id, dayOfWeek: { $in: dayOfWeek } });
    if (existingSchedule) {
      return res.status(400).json({ message: `A schedule already exists for ${dayOfWeek} at ${locationName}.` });
    }

    const startTimeMillis = Date.parse(`01/01/2000 ${startTime}`);
    const endTimeMillis = Date.parse(`01/01/2000 ${endTime}`);

    // Loop through each day of the week
    for (const day of dayOfWeek) {
        // Find schedules for the current day
        const schedules = await Sched.find({ doctor: doctorId, dayOfWeek: day });

        // Check for conflicts with each schedule for the current day
        for (const schedule of schedules) {
            const scheduleStartTimeMillis = Date.parse(`01/01/2000 ${schedule.startTime}`);
            const scheduleEndTimeMillis = Date.parse(`01/01/2000 ${schedule.endTime}`);

            // Check if there is an overlap between the new schedule and the current schedule
            if (
                (startTimeMillis >= scheduleStartTimeMillis && startTimeMillis < scheduleEndTimeMillis) ||
                (endTimeMillis > scheduleStartTimeMillis && endTimeMillis <= scheduleEndTimeMillis) ||
                (startTimeMillis <= scheduleStartTimeMillis && endTimeMillis >= scheduleEndTimeMillis)
            ) {
                // Fetch the location name for the conflicting schedule
                const locName = await Loc.findOne({ _id: schedule.location });

                // Return the conflict message
                return res.status(400).json({
                    message: `Conflicting time slot for ${day} at ${locName ? locName.name : 'Unknown location'}.`
                });
            }
        }
    }

    // Create the new schedule
    const newSchedule = new Sched({
      doctor: doctorId,
      location: location._id,
      dayOfWeek: dayOfWeek,
      startTime: startTime,
      endTime: endTime,
      maxAppointments: maxAppointments
    });

    // Save the new schedule
    const savedSchedule = await newSchedule.save();

    // Add the schedule to the doctor's schedule array
    doctor.schedule.push(savedSchedule._id);
    await doctor.save();

    res.status(201).json({ message: "Schedule added successfully.", schedule: savedSchedule });
  } catch (error) {
    console.error("Error adding schedule:", error);
    res.status(500).json({ message: "An error occurred while adding the schedule." });
  }
};

exports.editSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const doctorId = req.body.doctorId; // Assuming you pass the doctorId in the request body

    // Check if the doctor exists
    const doctor = await Med.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Find the schedule
    const schedule = await Sched.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found." });
    }

    // Check if the schedule belongs to the doctor
    if (!doctor.schedule.includes(scheduleId)) {
      return res.status(403).json({ message: "You don't have permission to edit this schedule." });
    }

    // Update the schedule fields
    if (req.body.location) {
      // Check if the location exists
      let location = await Loc.findOne({ name: req.body.location });
      if (!location) {
        // If the location doesn't exist, create a new one
        location = new Loc({ name: req.body.location });
        await location.save();
      }
      // Update the schedule with the location ID
      schedule.location = location._id;
    }
    if (req.body.dayOfWeek) {
      schedule.dayOfWeek = req.body.dayOfWeek;
    }
    if (req.body.startTime) {
      schedule.startTime = req.body.startTime;
    }
    if (req.body.endTime) {
      schedule.endTime = req.body.endTime;
    }
    if (req.body.maxAppointments) {
      schedule.maxAppointments = req.body.maxAppointments;
    }

    // Save the updated schedule
    const updatedSchedule = await schedule.save();

    res.status(200).json({
      message: "Schedule updated successfully",
      updatedSchedule: updatedSchedule
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: "An error occurred while updating the schedule." });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const doctorId = req.body.doctorId; // Assuming you pass the doctorId in the request body

    // Find the doctor
    const doctor = await Med.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Find the schedule
    const schedule = await Sched.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found." });
    }

    // Check if the schedule belongs to the doctor
    if (!doctor.schedule.includes(scheduleId)) {
      return res.status(403).json({ message: "You don't have permission to delete this schedule." });
    }

    // Remove the schedule from the doctor's schedule array
    doctor.schedule.pull(scheduleId);
    await doctor.save();

    // Delete the schedule
    const deletedSchedule = await Sched.findByIdAndDelete(scheduleId);
    
    res.status(200).json({
      message: "Schedule deleted successfully.",
      deletedSchedule: deletedSchedule
    });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: "An error occurred while deleting the schedule." });
  }
};

exports.getSchedules = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { userId } = req;

    const user = await Med.findById(userId).populate("role", "-__v");
    console.log("User:", user); // Check if user object exists
    if (!user || (user.role.name !== 'ROLE_MEDICAL_PERSONNEL' && user.role.name !== 'admin' && user.role.name !== 'medical_personnel') || user._id.toString() !== doctorId) {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    // Find the doctor
    const doctor = await Med.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Find all schedules of the doctor
    const schedules = await Sched.find({ doctor: doctorId });

    res.status(200).json({ schedules: schedules });
  } catch (error) {
    console.error('Error getting schedules:', error);
    res.status(500).json({ message: "An error occurred while getting schedules." });
  }
};

exports.viewAppointmentsUnderSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { status } = req.params;
    const doctorId = req.userId;

    // Find the schedule
    const schedule = await Sched.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found." });
    }

    // Check if the doctor is authorized to view appointments for this schedule
    if (schedule.doctor.toString() !== doctorId) {
      return res.status(403).json({ message: "You are not authorized to view appointments for this schedule." });
    }

    // Find all appointments for this schedule
    const appointments = await Appoint.find({ schedule: scheduleId, status: status })
    .populate({
      path: 'patient',
      select: 'fullname email'
    })

    res.status(200).json({ appointments: appointments });
  } catch (error) {
    console.error("Error fetching appointments under schedule:", error);
    res.status(500).json({ message: "An error occurred while fetching appointments under schedule." });
  }
};