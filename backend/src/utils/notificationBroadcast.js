// for chunsks of student notification



import admin from "../config/firebaseNotification.js";
import { getCollegeStudentModel } from "../models/collegeStudent.model.js";

export const broadcastToStudents = async (collegeConn, title, body) => {
  const Student = getCollegeStudentModel(collegeConn);

  const students = await Student.find({ fcmToken: { $exists: true, $ne: "" } })
    .select("fcmToken");

  if (!students.length) return;

  const tokens = students.map(s => s.fcmToken);

  // FCM allows max 500 tokens per request
  const chunks = [];
  while (tokens.length) chunks.push(tokens.splice(0, 500));

  for (const batch of chunks) {
    await admin.messaging().sendEachForMulticast({
      tokens: batch,
      data: { title, body }
    });
  }
};
