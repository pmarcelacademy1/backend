import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use an App Password if 2FA is enabled
  },
});

transporter.verify((error, success) => {
  if (error) console.error("Nodemailer config error:", error);
  else console.log("Nodemailer ready");
});

export default transporter;