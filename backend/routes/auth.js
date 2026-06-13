const express = require("express");
const router = express.Router();
const User = require('../models/User');
const Otp = require('../models/Otps');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");
const JWT_SECRET = process.env.JWT_SECRET;

router.post(
  "/signin",
  [
    body("username", "Enter a valid username").exists(),
    body("password", "password cannot be empty").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email and password",
      });
    }

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid username or password" });
      }

      const comparePass = await bcrypt.compare(password, user.password);
      if (!comparePass) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid Password or Username" });
      }
      const token = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(token, JWT_SECRET, { expiresIn: "10d" });

      return res.json({ success: true, authToken: authToken,isVerified:user.isVerified});
    } catch (error) {
      return res.json({ success: false, message: "internal server error" });
    }
  }
);

router.post('/signup', async (req, res) => {

})

module.exports = router;