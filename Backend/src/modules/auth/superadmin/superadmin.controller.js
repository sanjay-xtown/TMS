import SuperAdmin from "./superadmin.model.js";
import School from "../../school/school.model.js";
import SchoolAdmin from "../schooladmin/schooladmin.model.js";

import Bus from "../../bus/bus.model.js";
import Student from "../../student/student.model.js";
import jwt from "jsonwebtoken";

// SuperAdmin Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await SuperAdmin.findOne({ where: { email } });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role, email: admin.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create School
export const createSchool = async (req, res) => {
  try {
    const school = await School.create(req.body);
    res.status(201).json({ success: true, data: school });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve / Reject School
export const updateSchoolStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED, REJECTED

    const school = await School.findByPk(id);
    if (!school) return res.status(404).json({ success: false, message: "School not found" });

    school.status = status;
    await school.save();

    res.status(200).json({ success: true, message: `School status updated to ${status}`, data: school });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View all Schools
export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.findAll();
    res.status(200).json({ success: true, data: schools });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View all SchoolAdmins
export const getAllSchoolAdmins = async (req, res) => {
  try {
    const admins = await SchoolAdmin.findAll({
      include: [{ model: School, as: 'school', attributes: ['schoolName'] }]
    });
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const schoolCount = await School.count();
    const busCount = await Bus.count();
    const studentCount = await Student.count();
    const adminCount = await SchoolAdmin.count();

    res.status(200).json({
      success: true,
      stats: {
        totalSchools: schoolCount,
        totalBuses: busCount,
        totalStudents: studentCount,
        totalAdmins: adminCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seed SuperAdmin (Temporary helper for testing)
export const seedSuperAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await SuperAdmin.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const admin = await SuperAdmin.create({ username, email, password });
    res.status(201).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

