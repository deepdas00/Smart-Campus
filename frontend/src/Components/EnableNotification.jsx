import { requestPermission } from "../notifications";

export default function EnableNotification() {
  return (
    <button
      onClick={requestPermission}
      className="px-4 py-2 bg-indigo-600 text-white rounded"
    >
      Enable Notifications 🔔
    </button>
  );
}
