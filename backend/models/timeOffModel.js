const pool = require('../config/db');

const TimeOff = {
    async getAll() {
        const [rows] = await pool.query(`
            SELECT t.*, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, e.job_title 
            FROM time_off_requests t 
            JOIN employees e ON t.employee_id = e.id 
            ORDER BY t.id DESC
        `);
        return rows;
    },
    async create({ employee_id, start_date, end_date, reason }) {
        const [result] = await pool.query(
            'INSERT INTO time_off_requests (employee_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, "pending")',
            [employee_id, start_date, end_date, reason]
        );
        return { id: result.insertId, employee_id, start_date, end_date, reason, status: 'pending' };
    },
    async updateStatus(id, status) {
        await pool.query('UPDATE time_off_requests SET status = ? WHERE id = ?', [status, id]);
        return { id: parseInt(id), status };
    }
};

module.exports = TimeOff;