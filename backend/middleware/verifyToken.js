const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("authToken");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied",
      });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(data.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify OTP",
      });
    }

    if (!user.isLoggedIn) {
      return res.status(401).json({
        success: false,
        message: "Please login again",
      });
    }

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

module.exports = verifyToken;
