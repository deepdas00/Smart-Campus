import { io } from "../index.js";

/**
 * Broadcast event to one or multiple roles in a college
 *
 * @param {string} collegeCode
 * @param {string | string[]} roles - "student" | ["student","staff"]
 * @param {object} data - { event: "eventName", ...payload }
 */


export const broadcastViaSocket = (collegeCode, roles, data) => {
  console.log("ihhihi");
  
  if (!collegeCode || !data?.event) return;
  
  // normalize roles to array
  const roleList = Array.isArray(roles) ? roles : [roles];
  
  roleList.forEach((role) => {
    const room = `${collegeCode}:${role}`;
    io.to(room).emit(data.event, data);
  });
  console.log("byeyeyyeyeye");
};




//if multiple roles are allowed!!??