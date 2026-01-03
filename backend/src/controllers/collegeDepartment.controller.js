import { asyncHandler } from "../utils/asyncHandler.js";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { getCollegeDepartmentModel } from "../models/collegeDepartment.model.js";

// ===========================
// ➕ Create Department
// ===========================
export const createDepartment = asyncHandler(async (req, res) => {
  const { collegeCode } = req.user;
  const { departmentName, shortCode } = req.body;

  if (!departmentName || !shortCode)
    return res.status(400).json({ message: "Department name and shortcode required" });

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });

  if (!college) return res.status(404).json({ message: "College not found" });

  const collegeConn = getCollegeDB(college.dbName);
  const Department = getCollegeDepartmentModel(collegeConn);

  const existing = await Department.findOne({ departmentName });
  if (existing)
    return res.status(409).json({ message: "Department already exists" });

  const department = await Department.create({ departmentName, shortCode });

  res.status(201).json({ message: "Department created", data: department });
});

// ===========================
// ✏ Update Department
// ===========================
export const updateDepartment = asyncHandler(async (req, res) => {
  const { collegeCode } = req.user;
  const { departmentId } = req.params;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) return res.status(404).json({ message: "College not found" });

  const collegeConn = getCollegeDB(college.dbName);
  const Department = getCollegeDepartmentModel(collegeConn);

  const department = await Department.findByIdAndUpdate(
    departmentId,
    req.body,
    { new: true, runValidators: true }
  );

  if (!department)
    return res.status(404).json({ message: "Department not found" });

  res.status(200).json({ message: "Department updated", data: department });
});

// ===========================
// 🔁 Toggle Department Active/Inactive
// ===========================
export const toggleDepartmentStatus = asyncHandler(async (req, res) => {
  const { collegeCode } = req.user;
  const { departmentId } = req.params;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) return res.status(404).json({ message: "College not found" });

  const collegeConn = getCollegeDB(college.dbName);
  const Department = getCollegeDepartmentModel(collegeConn);

  const department = await Department.findById(departmentId);
  if (!department)
    return res.status(404).json({ message: "Department not found" });

  department.isActive = !department.isActive;
  await department.save({ validateBeforeSave: false });

  res.status(200).json({
    message: `Department is now ${department.isActive ? "Active" : "Inactive"}`,
    status: department.isActive
  });
});

// ===========================
// 📚 Fetch All Departments
// ===========================
export const fetchAllDepartments = asyncHandler(async (req, res) => {
  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) return res.status(404).json({ message: "College not found" });

  const collegeConn = getCollegeDB(college.dbName);
  const Department = getCollegeDepartmentModel(collegeConn);

  const departments = await Department.find().sort({ departmentName: 1 });

  res.status(200).json({ total: departments.length, data: departments });
});
