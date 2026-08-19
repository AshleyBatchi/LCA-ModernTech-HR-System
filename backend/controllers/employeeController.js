const Employee = require('../models/employeeModel');

exports.getEmployees = async (req, res) => {
    try {
        const data = await Employee.getAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve employee records.' });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const { first_name, last_name, email, job_title, department_id, salary, hire_date } = req.body;
        if (!first_name || !last_name || !email || !job_title || !department_id || !salary || !hire_date) {
            return res.status(400).json({ error: 'All fields are mandatory.' });
        }
        const created = await Employee.create(req.body);
        res.status(201).json(created);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create employee record.' });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { first_name, last_name, email, job_title, department_id, salary, hire_date } = req.body;
        if (!first_name || !last_name || !email || !job_title || !department_id || !salary || !hire_date) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const updated = await Employee.update(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update employee record.' });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        await Employee.remove(req.params.id);
        res.json({ message: 'Employee successfully deleted.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete employee record.' });
    }
};