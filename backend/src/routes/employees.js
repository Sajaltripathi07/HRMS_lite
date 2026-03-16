const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const validate = require("../middleware/validate");

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
});

router.post(
  "/",
  [
    body("employeeId").trim().notEmpty().withMessage("Employee ID is required"),
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("department").trim().notEmpty().withMessage("Department is required"),
  ],
  validate,
  async (req, res) => {
    try {
      const { employeeId, fullName, email, department } = req.body;

      const existing = await Employee.findOne({
        $or: [{ employeeId }, { email }],
      });

      if (existing) {
        if (existing.employeeId === employeeId) {
          return res.status(409).json({ message: "Employee ID already exists" });
        }
        return res.status(409).json({ message: "Email already registered" });
      }

      const employee = await Employee.create({ employeeId, fullName, email, department });
      res.status(201).json(employee);
    } catch (err) {
      res.status(500).json({ message: "Failed to create employee" });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await Attendance.deleteMany({ employee: req.params.id });
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete employee" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const departments = await Employee.distinct("department");
    const totalPresent = await Attendance.countDocuments({ status: "Present" });
    const totalAttendance = await Attendance.countDocuments();

    res.json({
      totalEmployees,
      totalDepartments: departments.length,
      attendanceRate: totalAttendance > 0 ? Math.round((totalPresent / totalAttendance) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
