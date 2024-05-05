const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const { getAllSchedules } = require("../controllers/schedule.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/med",
    [authJwt.verifyToken, authJwt.isMedicalPersonnel],
    controller.medicalBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get("/api/schedules/:doctorId", [authJwt.verifyToken], getAllSchedules);
};