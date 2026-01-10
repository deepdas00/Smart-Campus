import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, html }) => {
  console.log("SMTP TRYING TO CONNECT");
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2"
    }
  });

  

  await transporter.sendMail({
    from: `"Smart Campus System" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });


};
