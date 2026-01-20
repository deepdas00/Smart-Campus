import { socket } from "../socket.js";

export const connectSocket = ({ collegeCode, role }) => {
  console.log("🔌 connectSocket called", { collegeCode, role });

  if (!socket.connected) {
    socket.connect();

    socket.emit("joinRoom", {
      collegeCode,
      role,
    });

    console.log("📡 joinRoom emitted");
  }
};
