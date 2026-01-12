// import nodemailer from "nodemailer";

// export const sendMail = async ({ to, subject, html }) => {
//   console.log("SMTP TRYING TO CONNECT");

//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//     connectionTimeout: 10000,
//     greetingTimeout: 10000,
//     socketTimeout: 10000,
//     tls: {
//       rejectUnauthorized: false,
//       minVersion: "TLSv1.2",
//       servername: "smtp.gmail.com"
//     }
//   });

//   await transporter.verify();

//   console.log("SMTP CONNECTED");

//   await transporter.sendMail({
//     from: `"Smart Campus System" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     html
//   });

//   console.log("MAIL SENT");
// };







import SibApiV3Sdk from "sib-api-v3-sdk";

export const sendMail = async ({ to, subject, html }) => {
  const client = SibApiV3Sdk.ApiClient.instance;
console.log("working!!1");
console.log("BREVO KEY PRESENT:", !!process.env.BREVO_API_KEY);


client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

await apiInstance.sendTransacEmail({
  sender: { email: "smartcampus.official@gmail.com", name: "Smart Campus" },
  to: [{ email: to }],
  subject,
  htmlContent: html
});
console.log("working!!2");
};