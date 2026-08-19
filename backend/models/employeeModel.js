const pool = require('../config/db');

const Employee = {
    async getAll() {
        const [rows] = await pool.query(`
            SELECT e.*, d.name AS department_name, d.location AS department_location 
            FROM employees e 
            JOIN departments d ON e.department_id = d.id 
            ORDER BY e.id DESC
        `);
        return rows;
    },
    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
        return rows[0];
    },
    async create({ first_name, last_name, email, job_title, department_id, salary, hire_date }) {
        const [result] = await pool.query(
            'INSERT INTO employees (first_name, last_name, email, job_title, department_id, salary, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, job_title, department_id, salary, hire_date]
        );
        return { id: result.insertId, first_name, last_name, email, job_title, department_id, salary, hire_date };
    },
    async update(id, { first_name, last_name, email, job_title, department_id, salary, hire_date }) {
        await pool.query(
            'UPDATE employees SET first_name=?, last_name=?, email=?, job_title=?, department_id=?, salary=?, hire_date=? WHERE id=?',
            [first_name, last_name, email, job_title, department_id, salary, hire_date, id]
        );
        return { id: parseInt(id), first_name, last_name, email, job_title, department_id, salary, hire_date };
    },
    async remove(id) {
        const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Employee;