const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ isAuthenticated: false, isAdmin: false });
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");

    if (!decodedToken) {
      return res.status(401).json({
        isAuthenticated: false,
        isAdmin: false,
      });
    }

    req.userId = decodedToken.userId;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ isAuthenticated: false, isAdmin: false });
  }
};
