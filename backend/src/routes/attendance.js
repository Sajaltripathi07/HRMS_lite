const express = require("express");
const { body, query } = require("express-validator");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const validate = require("../middleware/validate");

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.employeeId) {
      const emp = await Employee.findById(req.query.employeeId);
      if (!emp) return res.status(404).json({ message: "Employee not found" });
      filter.employee = req.query.employeeId;
    }
    if (req.query.date) {
      filter.date = req.query.date;
    }

    const records = await Attendance.find(filter)
      .populate("employee", "employeeId fullName department")
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
});

router.post(
  "/",
  [
    body("employeeId").notEmpty().withMessage("Employee ID is required"),
    body("date").notEmpty().withMessage("Date is required"),
    body("status").isIn(["Present", "Absent"]).withMessage("Status must be Present or Absent"),
  ],
  validate,
  async (req, res) => {
    try {
      const { employeeId, date, status } = req.body;

      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      const existing = await Attendance.findOne({ employee: employeeId, date });
      if (existing) {
        existing.status = status;
        await existing.save();
        const populated = await existing.populate("employee", "employeeId fullName department");
        return res.json(populated);
      }

      const record = await Attendance.create({ employee: employeeId, date, status });
      const populated = await record.populate("employee", "employeeId fullName department");
      res.status(201).json(populated);
    } catch (err) {
      res.status(500).json({ message: "Failed to mark attendance" });
    }
  }
);

router.get("/employee/:id", async (req, res) => {
  try {
    const records = await Attendance.find({ employee: req.params.id })
      .populate("employee", "employeeId fullName department")
      .sort({ date: -1 });

    const totalPresent = records.filter((r) => r.status === "Present").length;

    res.json({ records, totalPresent, totalDays: records.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
});

module.exports = router;
