const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Otps = require("../models/Otps");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const sendOtp = require("../services/otpService");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = require("../middleware/verifyToken");
const tempVerifyToken = require("../middleware/tempVerifyToken");

router.post("/verify-otp", tempVerifyToken, async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id;

  try {
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const otpRecord = await Otps.findOne({ user: userId }).sort({
      createdAt: -1,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (otpRecord.validTill < new Date()) {
      await Otps.deleteMany({ user: userId });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await User.findByIdAndUpdate(
      userId,
      {
        isVerified: true,
        isLoggedIn: true,
      },
      { new: true },
    );

    await Otps.deleteMany({ user: userId });

    const data = {
      user: {
        id: userId,
      },
    };

    const authToken = jwt.sign(data, JWT_SECRET, {
      expiresIn: "10d",
    });

    return res.json({
      success: true,
      message: "OTP verified successfully",
      authToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid details",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPass,
      isVerified: false,
    });

    const otpSent = await sendOtp(user.id, user.email);

    if (!otpSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }

    const tempToken = jwt.sign(
      {
        user: {
          id: user.id,
        },
      },
      JWT_SECRET,
      { expiresIn: "10m" },
    );

    return res.json({
      success: true,
      message: "OTP sent successfully",
      tempToken,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post(
  "/signin",
  [
    body("username", "Enter a valid username").exists(),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid username and password",
      });
    }

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      const comparePass = await bcrypt.compare(password, user.password);

      if (!comparePass) {
        return res.status(400).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      await sendOtp(user.id, user.email);

      const tempToken = jwt.sign(
        {
          user: {
            id: user.id,
          },
        },
        JWT_SECRET,
        { expiresIn: "10m" },
      );

      return res.json({
        success: true,
        message: "OTP sent successfully",
        tempToken,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

router.post(
  "/logout",
  verifyToken,
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          isLoggedIn: false,
        }
      );

      return res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

module.exports = router;
