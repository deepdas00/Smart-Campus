import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, html }) => {
  console.log("SMTP TRYING TO CONNECT");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
      servername: "smtp.gmail.com"
    }
  });

  await transporter.verify();

  console.log("SMTP CONNECTED");

  await transporter.sendMail({
    from: `"Smart Campus System" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });

  console.log("MAIL SENT");
};