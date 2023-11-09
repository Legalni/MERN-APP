const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let currentUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Ne postoji korisnik sa ovim e-mailom.");
    }
    currentUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Pogresna lozinka.");
    }

    const token = jwt.sign(
      {
        email: currentUser.email,
        userId: currentUser._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );
    console.log(token);
    res
      .status(200)
      .cookie("token", token, {
        maxAge: 3600000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "None",
        path: "/",
      })
      .json({
        userId: currentUser._id.toString(),
        token: token,
      });
    console.log(req.cookies);
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
