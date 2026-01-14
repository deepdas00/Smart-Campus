import admin from "../config/firebaseNotification.js";

export const sendNotification = (fcmToken, title, body) => {
  if (!fcmToken) return;

  setImmediate(async () => {
    try {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title,
          body
        }
      });
    } catch (err) {
      console.error("FCM error:", err.message);
    }
  });
};
