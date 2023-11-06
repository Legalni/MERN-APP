const User = require("../models/user");

exports.getUserInformations = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    console.log(user);

    res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
  }
};
