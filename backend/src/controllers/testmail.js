import { buildTeacherCredentialsMailTemplate } from "../template/buildTeacherCredentialsMailTemplate.js";
import { sendMail } from "../utils/sendMail.js";

import dotenv from "dotenv";
dotenv.config({
  path: "../../.env",
});


const testTeacherMail = async () => {
  const loginId = "abc_trideep";
  const password = "123456_abc";
  const collegeName = "ST. XAVIERS COLLEGE, BURDWAN";
  const fullName = "Trideep Ray";
  const email = "raytrideep60@gmail.com";

  await sendMail({
    to: email,
    subject: `${collegeName} - Your Teacher Login Credentials`,
    html: buildTeacherCredentialsMailTemplate( /////////////////////////////////////////
      collegeName,
      fullName,
      { loginId, password }
    )
  });

  console.log("✅ Test mail sent successfully");
};

// 🔥 actually run the test
testTeacherMail();
