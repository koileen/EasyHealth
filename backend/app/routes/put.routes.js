const schedController = require("../controllers/schedule.controller");
module.exports = function(app) {
    app.put("/api/schedule/edit/:scheduleId", schedController.editSchedule);
};