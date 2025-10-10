const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Import the middleware from userRoutes (ensure it's exported there)
const { authenticateToken } = require('./userRoutes');

// GET all employees
router.get('/', authenticateToken, async (req, res) => {
  try {
    const employees = await Employee.find({}, { __v: 0 }); // Exclude __v
    res.status(200).json(employees.map(emp => ({
      employee_id: emp._id,
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      position: emp.position,
      salary: emp.salary,
      date_of_joining: emp.date_of_joining,
      department: emp.department
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new employee
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;
    const newEmployee = new Employee({ 
      first_name, last_name, email, position, salary, date_of_joining, department 
    });
    await newEmployee.save();
    res.status(201).json({ 
      message: 'Employee created successfully', 
      employee_id: newEmployee._id 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET employee by eid (path param)
router.get('/:eid', authenticateToken, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.eid);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({
      employee_id: employee._id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      position: employee.position,
      salary: employee.salary,
      date_of_joining: employee.date_of_joining,
      department: employee.department
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update employee by eid (path param)
router.put('/:eid', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    updates.updated_at = Date.now();
    const employee = await Employee.findByIdAndUpdate(
      req.params.eid,
      updates,
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee details updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE employee by eid (query param)
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const { eid } = req.query;
    if (!eid) return res.status(400).json({ message: 'eid query parameter required' });
    const employee = await Employee.findByIdAndDelete(eid);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;