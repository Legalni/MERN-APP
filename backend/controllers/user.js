const User = require("../models/user");

exports.getUserInformations = async (req, res, next) => {
  console.log(req.get("Authorization"));

  try {
    const user = await User.findById(req.userId);

    res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
  }
};
