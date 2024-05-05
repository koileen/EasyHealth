const schedController = require("../controllers/schedule.controller");

module.exports = function(app) {
    app.delete("/api/schedule/delete/:scheduleId", schedController.deleteSchedule);
};