// for single student notification


import admin from "../config/firebaseNotification.js";
import { getCollegeStudentModel } from "../models/collegeStudent.model.js";

export const sendNotification = async (
  collegeConn,
  fcmToken,
  title,
  body,
  data = {}
) => {


  if (!fcmToken) return;

  try {
    console.log("1st hu ");
    await admin.messaging().send({
      token: fcmToken,
      data: {
        title,
        body,
      },
    });
    console.log("2nd hu ");

  } catch (err) {
    console.log("FCM error:", err.code || err.message);

    // 🔥 Cleanup invalid tokens
    if (
      err.code === "messaging/registration-token-not-registered" ||
      err.code === "messaging/invalid-registration-token"
    ) {

      const Student = getCollegeStudentModel(collegeConn)
      await Student.updateOne(
        { fcmToken },
        { $unset: { fcmToken: "" } }
      );
    }

  }
};

