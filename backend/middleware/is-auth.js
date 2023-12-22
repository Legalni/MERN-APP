const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(200).json({ isAuthenticated: false, isAdmin: false });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");
  } catch (err) {
    return res.status(200).json({ isAuthenticated: false, isAdmin: false });
  }
  if (!decodedToken) {
    return res.status(200).json({
      isAuthenticated: false,
      isAdmin: false,
    });
  }
  req.userId = decodedToken.userId;
  return next();
};
