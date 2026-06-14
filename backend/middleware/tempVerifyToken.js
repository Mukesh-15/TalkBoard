const jwt = require("jsonwebtoken");

const tempVerifyToken = (req, res, next) => {
  try {
    const token = req.header("authToken");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const data = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = data.user;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = tempVerifyToken;