# ModernTech Solutions HR System

## Description
ModernTech Solutions HR System is an enterprise full-stack Human Resource Management application. It provides authenticated HR staff and managers with complete capabilities to manage employees, execute real-time automated payroll calculations, and review time-off requests backed by a 3NF normalised MySQL database.

## Tech Stack
* **Node.js:** JavaScript server runtime environment for backend APIs.
* **Express:** Web application framework for RESTful routing and middleware.
* **MySQL:** Relational database on port 3307 for persistent 3NF data storage.
* **Vue 3:** Progressive reactive framework for the dynamic user interface.
* **Vite:** Next-generation frontend build tooling.
* **Axios:** Promise-based HTTP client for asynchronous API consumption.
* **mysql2:** Promise-based MySQL driver utilizing parameterized queries.
* **bcryptjs:** Industry-standard password hashing library.
* **jsonwebtoken (JWT):** Token-based stateless authentication.
* **cors & dotenv:** Cross-Origin Resource Sharing and environment configuration management.

## Prerequisites
* Node.js and npm installed.
* MySQL service running specifically on port **3307**.
* Environment variables configured via `.env` files.

## Environment Variables
Inside `backend/.env`:
```text
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=moderntech_hr
JWT_SECRET=ModernTechSuperSecretKey2026
