const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendingMail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Adverse" <no-reply@adverse.com>',
    to,
    subject,
    html, // <-- use html property, not text
  });
};
