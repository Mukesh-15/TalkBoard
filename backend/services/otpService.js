// const bcrypt = require("bcryptjs");
// const nodemailer = require("nodemailer");
// const Otps = require("../models/Otps");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",  // explicit host instead of 'service: gmail'
//   port: 587,
//   family: 4,               //  force IPv4
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });


// const sendOtp = async (userId, email) => {
//   try {
//     await Otps.deleteMany({ user: userId });

//     const rawOtp = Math.floor(
//       100000 + Math.random() * 900000
//     ).toString();

//     const hashedOtp = await bcrypt.hash(rawOtp, 10);

//     const validTill = new Date(
//       Date.now() + 5 * 60 * 1000
//     );

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Your OTP Code",
//       html: `
//       <h2>Your OTP is: ${rawOtp}</h2>
//       <p>This expires in 5 minutes.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     await Otps.create({
//       user: userId,
//       otp: hashedOtp,
//       validTill,
//     });

//     return true;
    
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };

// module.exports = sendOtp;


const bcrypt = require("bcryptjs");
const { Resend } = require("resend");
const Otps = require("../models/Otps");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtp = async (userId, email) => {
  try {
    await Otps.deleteMany({ user: userId });

    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);
    const validTill = new Date(Date.now() + 5 * 60 * 1000);

    await resend.emails.send({
      from: "talkBoard <onboarding@resend.dev>",
      to: "krishnadoodapaka@gmail.com",
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP is: ${rawOtp}</h2>
        <p>This expires in 5 minutes.</p>
      `,
    });

    await Otps.create({
      user: userId,
      otp: hashedOtp,
      validTill,
    });

    return true;

  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = sendOtp;