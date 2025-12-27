import mongoose from "mongoose";
import { MASTER_DB_NAME } from "../constants.js";

const connections = {};

/**
 * Master DB (fixed)
 */
export const connectMasterDB = () => {
  if (!connections.master) {
    connections.master = mongoose.createConnection(
  `${process.env.MONGODB_URI}/${MASTER_DB_NAME}`
);
    console.log("✅ Master DB Connected");
  }
  return connections.master;
};

/**
 * College DB (dynamic)
 */
export const getCollegeDB = (dbName) => {
  if (!connections[dbName]) {
    connections[dbName] = mongoose.createConnection(
      `${process.env.MONGODB_URI}/${dbName}`
    );
    console.log(`✅ Connected to ${dbName}`);
  }
  return connections[dbName];
};
