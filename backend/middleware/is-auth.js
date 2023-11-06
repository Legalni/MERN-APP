const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    res.status(401).json({
      status: "failll",
      message: "Unauthorizedd!",
    });
  }
  const token = authHeader.split(" ")[1] || req.headers["authorization"];
  console.log(token);
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");
    console.log(decodedToken);
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "Unauthorized!",
    });
  }
  if (!decodedToken) {
    res.status(401).json({
      status: "fail",
      message: "Unauthorized!",
    });
  }
  req.userId = decodedToken.userId;
  console.log(decodedToken);
  next();
};
