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
* MySQL running specifically on port **3307**.
* A `.env` file inside `backend/` and `frontend/`.

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


InstallationBackend:Bashcd backend
npm install
Frontend:Bashcd ../frontend
npm install
How to RunStart Backend:Bashcd backend
npm start
Start Frontend:Bashcd frontend
npm run dev
Access the dashboard at http://localhost:5173. Use credentials admin@moderntech.co.za and Password123!.API EndpointsMethodEndpointAuth RequiredDescriptionPOST/api/auth/loginNoAuthenticates user and returns JWTGET/api/departmentsYesRetrieves all departmentsGET/api/employeesYesRetrieves all employee recordsPOST/api/employeesYesCreates new employee recordPUT/api/employees/:idYesUpdates an employee recordDELETE/api/employees/:idYesDeletes an employee recordGET/api/time-offYesRetrieves all time off requestsPOST/api/time-offYesCreates a new time off requestPATCH/api/time-off/:id/statusYesUpdates status of time-off requestAuthorAshley Batchi, Life Choices Academy YouthCode Off-Site, Cohort 2.5. Click **Commit changes...** at the bottom.

---

### Step 2: Record Your Video Presentation (5–10 Minutes)

Use **OBS Studio** to record a walkthrough of the running system (`http://localhost:5173`):
1. **Login:** Log in with `admin@moderntech.co.za` and `Password123!`.
2. **Employee CRUD:** Add a new employee, edit an existing one, delete a test entry, and reload the page to demonstrate database persistence.
3. **Payroll:** Open the **Payroll Calculations** tab and show the dynamic salary total.
4. **Time-Off:** Open the **Time-Off Management** tab, submit a request, and demonstrate the **Approve** / **Reject** actions.
5. **Code & Architecture:** Briefly show the backend prepared statements in VS Code and the 4 tables in phpMyAdmin.

---

### Step 3: Clean Up and Create Submission ZIP

1. In VS Code, stop running terminals using **Ctrl + C**, then close VS Code.
2. Open Windows File Explorer and navigate into **`C:\xampp\htdocs\course2_core_project`**.
3. **Delete these 4 items**:
   * `backend/node_modules/`
   * `backend/.env`
   * `frontend/node_modules/`
   * `frontend/.env`
4. Go back to `C:\xampp\htdocs`, right-click **`course2_core_project`**, and select **Compress to ZIP file** to create **`course2_core_project.zip`**.

---

### Step 4: Submit on Google Classroom

1. Go to **Google Classroom** and open the **Course 2 - Core Project** assignment.
2. Attach **`course2_core_project.zip`**.
3. Attach your **video presentation file** (or link).
4. Paste the GitHub repository URL:
   ```text
   https://github.com/AshleyBatchi/LCA-ModernTech-HR-System

