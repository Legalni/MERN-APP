const { validationResult } = require("express-validator");
const User = require("../models/user");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let currentUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("Ne postoji korisnik sa ovim e-mailom.");
      error.statusCode = 404;
      throw error;
    }
    currentUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Uneli ste pogresnu lozinku");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: currentUser.email,
        userId: currentUser._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      })
      .json({
        userId: currentUser._id.toString(),
        token: token,
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error("Validacija neuspesna");
  }
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmedPassword = req.body.confirmedPassword;

  try {
    if (password !== confirmedPassword) {
      throw new Error("Lozinke se ne poklapaju.");
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    const result = await user.save();
    res.status(200).json({
      message: "Korisnik je uspesno kreiran.",
      userId: result._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.adminLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let currentAdmin;
  try {
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      const error = new Error("Ne postoji korisnik sa ovim e-mailom.");
      error.statusCode = 404;
      throw error;
    }
    currentAdmin = admin;
    const isEqual = await bcrypt.compare(password, admin.password);
    if (!isEqual) {
      const error = new Error("Uneli ste pogresnu lozinku");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: currentAdmin.email,
        userId: currentAdmin._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      })
      .json({
        userId: currentAdmin._id.toString(),
        token: token,
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

const generateToken = async (user, statusCode, res) => {};
