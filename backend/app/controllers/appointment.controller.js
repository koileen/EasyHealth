const db = require("../models");
const Appointment = db.appoint;
const Schedule = db.sched;

exports.addAppointment = async (req, res) => {
  try {
    const { doctorId, scheduleId, appointmentDate } = req.body;
    const { userId } = req;

    // Check if the schedule exists
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found." });
    }

    // Check if the appointment date is valid
    const appointmentDay = new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long' });
    if (!schedule.dayOfWeek.includes(appointmentDay)) {
      return res.status(400).json({ message: `Appointments are not scheduled on ${appointmentDay}.` });
    }

    // Check if the maximum appointments limit is reached
    const appointmentsCount = await Appointment.countDocuments({ schedule: scheduleId, appointmentDate });
    if (appointmentsCount >= schedule.maxAppointments) {
      return res.status(400).json({ message: "Maximum appointments limit reached for this schedule." });
    }

    // Create the new appointment
    const newAppointment = new Appointment({
      patient: userId,
      doctor: doctorId,
      schedule: scheduleId,
      appointmentDate: appointmentDate
    });

    // Save the new appointment
    const savedAppointment = await newAppointment.save();

    res.status(201).json({ message: "Appointment added successfully.", appointment: savedAppointment });
  } catch (error) {
    console.error("Error adding appointment:", error);
    res.status(500).json({ message: "An error occurred while adding the appointment." });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Check if the appointment is already cancelled or completed
    if (appointment.status !== 'Scheduled') {
      return res.status(400).json({ message: "This appointment is already cancelled or completed." });
    }

    // Update the appointment status to 'Cancelled'
    appointment.status = 'Cancelled';
    await appointment.save();

    res.status(200).json({ message: "Appointment cancelled successfully.", appointment: appointment });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "An error occurred while cancelling the appointment." });
  }
};

exports.viewScheduledAppointmentsPatient = async (req, res) => {
  try {
    const { patientId, status } = req.params;

    // Find all scheduled appointments for the patient
    const appointments = await Appointment.find({ patient: patientId, status: status })
    .populate({
      path: 'doctor',
      select: 'fullname email profession specializations' // Specify the fields you want to include
    })
    .populate('schedule');

    res.status(200).json({ appointments: appointments });
  } catch (error) {
    console.error("Error fetching scheduled appointments:", error);
    res.status(500).json({ message: "An error occurred while fetching scheduled appointments." });
  }
};