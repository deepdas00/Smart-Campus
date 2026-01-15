// import admin from "../config/firebaseNotification.js";

// export const sendNotification = (fcmToken, title, body) => {
//   if (!fcmToken) return;



//   setImmediate(async () => {
//     try {
//       await admin.messaging().send({
//         token: fcmToken,
//         notification: {
//           title,
//           body
//         }
//       });
//     } catch (err) {
//       console.error("FCM error:", err.message);
//     }
//   });
// };






import admin from "../config/firebaseNotification.js";

export const sendNotification = async (
  fcmToken,
  title,
  body,
  data = {}
) => {

  

  console.log(title, body);
  
  if (!fcmToken) return;
  console.log( "88484848484844848448");
  
  try {
    console.log( "1st hu ");
    await admin.messaging().send({
      token: fcmToken,
      data: {
        title,
        body,
      },
    
    });
    console.log( "2nd hu ");

  } catch (err) {
    console.log("FCM error:", err.code || err.message);

    // 🔥 Cleanup invalid tokens
    if (
      err.code === "messaging/registration-token-not-registered" ||
      err.code === "messaging/invalid-registration-token"
    ) {
      console.log("Invalid FCM token, should be removed from DB");
      // TODO: delete token from database
    }
  }
};

