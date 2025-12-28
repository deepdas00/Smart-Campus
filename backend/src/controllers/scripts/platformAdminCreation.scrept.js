import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({
  path: "../../../.env",
});
import {connectMasterDB} from "../../db/db.index.js"
import {getPlatformAdminModel } from "../../models/platformAdmin.model.js"


seedAdmin();


const seedAdmin = async () => {

  const masterConn = connectMasterDB();
  const PlatformAdmin = getPlatformAdminModel(masterConn);
console.log(process.env.PLATFORM_ADMIN_ID);

  const existing = await PlatformAdmin.findOne({
    loginId: process.env.PLATFORM_ADMIN_ID
  });

  if (existing) {
    console.log("Platform admin already exists");
    process.exit(0);
  }

  const hashed = await bcrypt.hash(process.env.PLATFORM_ADMIN_PASSWORD, 10);

  await PlatformAdmin.create({
    loginId: process.env.PLATFORM_ADMIN_ID,
    password: hashed,
    name: "System Owner",
    isSuperAdmin: true
  });

  console.log("Platform admin created successfully");
  process.exit(0);
};

