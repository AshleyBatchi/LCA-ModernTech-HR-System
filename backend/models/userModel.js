const pool = require('../config/db');

const User = {
    async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },
    async create(email, passwordHash, role = 'hr') {
        const [result] = await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, passwordHash, role]
        );
        return { id: result.insertId, email, role };
    }
};

module.exports = User;