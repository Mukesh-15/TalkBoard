const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifySocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.user.id).select(
      "_id username isVerified",
    );

    if (!user) {
      return next(new Error("User not found"));
    }

    if (!user.isVerified) {
      return next(new Error("Verify OTP first"));
    }

    socket.user = {
      id: user._id.toString(),
      username: user.username,
    };

    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
};

module.exports = verifySocket;
