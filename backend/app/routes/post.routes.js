const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const schedController = require("../controllers/schedule.controller");
const appointController = require("../controllers/appointment.controller");

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

  app.post("/api/schedule/add", schedController.addSchedule);

  app.post("/api/appointment/add", appointController.addAppointment);
};