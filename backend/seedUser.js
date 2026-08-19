const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
    try {
        const pool = mysql.createPool({
            host: '127.0.0.1',
            port: parseInt(process.env.DB_PORT, 10) || 3307,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'moderntech_hr'
        });

        const hash = await bcrypt.hash('Password123!', 10);

        await pool.query(`
            INSERT INTO users (email, password_hash, role) 
            VALUES ('admin@moderntech.co.za', ?, 'admin')
            ON DUPLICATE KEY UPDATE password_hash = ?
        `, [hash, hash]);

        console.log('✅ Admin user created/updated successfully!');
        console.log('Email: admin@moderntech.co.za');
        console.log('Password: Password123!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding user:', err);
        process.exit(1);
    }
}

seed();