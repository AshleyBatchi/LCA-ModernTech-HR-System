const pool = require('../config/db');

const Department = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM departments ORDER BY name ASC');
        return rows;
    }
};

module.exports = Department;