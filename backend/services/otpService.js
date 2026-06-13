const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Otps = require("../models/Otps");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtp = async (userId, email) => {
  try {
    await Otps.deleteMany({ user: userId });

    const rawOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    const validTill = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await Otps.create({
      user: userId,
      otp: hashedOtp,
      validTill,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `
      <h2>Your OTP is: ${rawOtp}</h2>
      <p>This expires in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = sendOtp;