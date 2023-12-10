const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    const decodedToken = jwt.verify(token, "somesupersecretsecret");

    if (!decodedToken) {
      return res.json({ isAuthenticated: false });
    }

    req.userId = decodedToken.userId;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ isAuthenticated: false });
  }
};
