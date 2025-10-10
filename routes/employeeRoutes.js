const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const authenticateToken = require('./userRoutes').authenticateToken;
// Create Employee
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { employeeId, firstName, lastName, department, salary } = req.body;
    const newEmployee = new Employee({ employeeId, firstName, lastName, department, salary });
    await newEmployee.save();
    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Employees
router.get('/', authenticateToken, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read Single Employee
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.id });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Employee
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, department, salary } = req.body;
    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.params.id },
      { firstName, lastName, department, salary, updated_at: Date.now() },
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Employee
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({ employeeId: req.params.id });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;