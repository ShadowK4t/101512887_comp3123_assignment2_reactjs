const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        status: false,
        message: errors.array()[0].msg
      });
    }

    const employeeData = {
      ...req.body,
      profile_picture: req.file ? req.file.filename : null
    };

    const employee = await Employee.create(employeeData);

    res.status(201).json({
      message: 'Employee created successfully.',
      employee_id: employee._id
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        status: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        status: false,
        message: errors.array()[0].msg
      });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      // Delete uploaded file if employee not found
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        status: false,
        message: 'Employee not found'
      });
    }

    // Delete old profile picture if new one is uploaded
    if (req.file && employee.profile_picture) {
      const oldImagePath = path.join(__dirname, '..', 'uploads', employee.profile_picture);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updateData = {
      ...req.body,
      ...(req.file && { profile_picture: req.file.filename })
    };

    await Employee.findByIdAndUpdate(req.params.id, updateData);

    res.status(200).json({
      message: 'Employee details updated successfully.'
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.query.eid;

    if (!employeeId) {
      return res.status(400).json({
        status: false,
        message: 'Employee ID is required'
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        status: false,
        message: 'Employee not found'
      });
    }

    // Delete profile picture if exists
    if (employee.profile_picture) {
      const imagePath = path.join(__dirname, '..', 'uploads', employee.profile_picture);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Employee.findByIdAndDelete(employeeId);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// Search employees by department or position
exports.searchEmployees = async (req, res) => {
  try {
    const { department, position } = req.query;

    if (!department && !position) {
      return res.status(400).json({
        status: false,
        message: 'Please provide department or position to search'
      });
    }

    const searchQuery = {};
    if (department) {
      searchQuery.department = { $regex: department, $options: 'i' };
    }
    if (position) {
      searchQuery.position = { $regex: position, $options: 'i' };
    }

    const employees = await Employee.find(searchQuery);

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};
