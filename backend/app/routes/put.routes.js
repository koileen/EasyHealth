const schedController = require("../controllers/schedule.controller");
const appointController = require("../controllers/appointment.controller");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.put("/api/schedule/edit/:scheduleId", schedController.editSchedule);
};

module.exports = function(app) {
    app.put("/api/appointments/cancel/:appointmentId", appointController.cancelAppointment);
};
module.exports = function(app) {
    app.put('/api/med/editmed/:medId', authJwt.verifyToken, controller.editMed);
}
