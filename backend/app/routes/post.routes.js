const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");
const schedController = require("../controllers/schedule.controller");
const appointController = require("../controllers/appointment.controller");
// const fileController = require("../controllers/file.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup_user
  );

  app.post("/api/auth/signin", controller.signin_user);

  app.post(
    "/api/med/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail
    ],
    controller.signup_med
  );

  app.post("/api/med/signin", controller.signin_med);

  app.post("/api/schedule/add", [authJwt.verifyToken], schedController.addSchedule);

  app.post("/api/appointment/add", [authJwt.verifyToken], appointController.addAppointment);

  // app.post("/api/file/upload", [authJwt.verifyToken], fileController.uploadFile);
};