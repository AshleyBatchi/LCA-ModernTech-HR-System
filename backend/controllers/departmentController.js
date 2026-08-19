const Department = require('../models/departmentModel');

exports.getDepartments = async (req, res) => {
    try {
        const data = await Department.getAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve departments.' });
    }
};