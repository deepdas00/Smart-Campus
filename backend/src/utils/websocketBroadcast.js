import { wss } from "../index.js";   // adjust path if needed

export const broadcastViaSocket = (collegeCode, role, data) => {
  wss.clients.forEach((client) => {
    if (
      client.readyState === 1 &&        // OPEN connection
      client.collegeCode === collegeCode &&
      client.role === role
    ) {
      client.send(JSON.stringify(data));
    }
  });
};



//if multiple roles are allowed!!??