const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const user = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      birthday: req.body.birthday,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    const savedUser = await user.save();

    const role = await Role.findOne({ name: { $in: req.body.roles } });
    savedUser.roles = role._id;

    await savedUser.save();

    res.status(201).json({ message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred while registering the user." });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate("roles", "-__v");
    console.log("User found:", user);

    if (!user) {
      console.log("User not found");
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    console.log("Password is valid:", passwordIsValid);

    if (!passwordIsValid) {
      console.log("Invalid password");
      return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 86400 // 24 hours
    });

    const authorities = ["ROLE_" + user.roles.name.toUpperCase()];

    res.status(200).send({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ message: "Error Signing in" });
  }
};
