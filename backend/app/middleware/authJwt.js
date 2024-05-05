const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    const decoded = await jwt.verify(token, config.secret);

    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Log-In First!" });
  }
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    const roles = await Role.find({ _id: { $in: user.role } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Require Admin Role!" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

isMedicalPersonnel = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    const roles = await Role.find({ _id: { $in: user.role } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "medical_personnel") {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Require Medical Personnel Role!" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isMedicalPersonnel
};
module.exports = authJwt;