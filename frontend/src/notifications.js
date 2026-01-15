import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const requestPermission = async () => {
  const permission = await Notification.requestPermission();
  console.log("Permission:", permission);

  if (permission === "granted") {
    const registration = await navigator.serviceWorker.ready;

    console.log("hiihihihihih", registration);
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log("FCM TOKEN:", token);

    const res = await axios.post(
      `${API_URL}/api/v1/auth/save-fcm-token`,
      {
        token,
        platform: "web",
      },
      {
        withCredentials: true,
      }
    );
    console.log(res);

  } else if (permission === "denied") {
    console.log("lalalllalalalalalalalalalalalallalaalalla hoye egeche")
    await axios.post(
      `${API_URL}/api/v1/auth/delete-fcm-token`,
      {},
      { withCredentials: true }
    );
  }

};




// onTokenChanged(messaging, async (newToken) => {
//   if (!newToken) return;

//   await axios.post(
//     `${API_URL}/api/v1/auth/save-fcm-token`,
//     { token: newToken, platform: "web" },
//     { withCredentials: true }
//   );
// });