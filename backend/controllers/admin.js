const Admin = require("../models/admin");

exports.getAdminInformations = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userId);
    res.status(200).json({ admin: admin });
  } catch (err) {
    console.log(err);
  }
};
