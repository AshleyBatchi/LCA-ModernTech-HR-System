<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auth State
const token = ref(localStorage.getItem('token') || '');
const loginForm = ref({ email: 'admin@moderntech.co.za', password: '' });
const currentTab = ref('employees'); // employees | payroll | timeoff

// Data State
const employees = ref([]);
const departments = ref([]);
const timeOffRequests = ref([]);
const error = ref(null);
const loading = ref(false);

// Forms
const empForm = ref({
  id: null,
  first_name: '',
  last_name: '',
  email: '',
  job_title: '',
  department_id: '',
  salary: '',
  hire_date: ''
});

const timeOffForm = ref({
  employee_id: '',
  start_date: '',
  end_date: '',
  reason: ''
});

const isEditing = ref(false);

const authAxios = () => {
  return axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${token.value}` }
  });
};

const handleLogin = async () => {
  error.value = null;
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, loginForm.value);
    token.value = res.data.token;
    localStorage.setItem('token', res.data.token);
    loadAllData();
  } catch (err) {
    error.value = err.response?.data?.error || 'Invalid login details.';
  }
};

const handleLogout = () => {
  token.value = '';
  localStorage.removeItem('token');
};

const loadAllData = async () => {
  if (!token.value) return;
  loading.value = true;
  error.value = null;
  try {
    const [empRes, deptRes, timeRes] = await Promise.all([
      authAxios().get('/employees'),
      authAxios().get('/departments'),
      authAxios().get('/time-off')
    ]);
    employees.value = empRes.data;
    departments.value = deptRes.data;
    timeOffRequests.value = timeRes.data;
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) handleLogout();
    error.value = 'Failed to fetch HR data from server.';
  } finally {
    loading.value = false;
  }
};

const saveEmployee = async () => {
  error.value = null;
  try {
    if (isEditing.value) {
      await authAxios().put(`/employees/${empForm.value.id}`, empForm.value);
    } else {
      await authAxios().post('/employees', empForm.value);
    }
    resetEmpForm();
    await loadAllData();
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to save employee.';
  }
};

const editEmployee = (emp) => {
  isEditing.value = true;
  empForm.value = { ...emp, hire_date: emp.hire_date.substring(0, 10) };
};

const deleteEmployee = async (id) => {
  if (!confirm('Are you sure you want to remove this employee record?')) return;
  try {
    await authAxios().delete(`/employees/${id}`);
    await loadAllData();
  } catch (err) {
    error.value = 'Failed to delete record.';
  }
};

const resetEmpForm = () => {
  isEditing.value = false;
  empForm.value = { id: null, first_name: '', last_name: '', email: '', job_title: '', department_id: '', salary: '', hire_date: '' };
};

const submitTimeOff = async () => {
  try {
    await authAxios().post('/time-off', timeOffForm.value);
    timeOffForm.value = { employee_id: '', start_date: '', end_date: '', reason: '' };
    await loadAllData();
  } catch (err) {
    error.value = 'Failed to submit time off request.';
  }
};

const updateTimeOffStatus = async (id, status) => {
  try {
    await authAxios().patch(`/time-off/${id}/status`, { status });
    await loadAllData();
  } catch (err) {
    error.value = 'Failed to update status.';
  }
};

const totalPayroll = computed(() => {
  return employees.value.reduce((sum, emp) => sum + Number(emp.salary || 0), 0);
});

onMounted(() => {
  if (token.value) loadAllData();
});
</script>

<template>
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f9; min-height: 100vh; padding: 20px;">
    <!-- LOGIN SCREEN -->
    <div v-if="!token" style="max-width: 400px; margin: 80px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <h2 style="text-align: center; color: #2c3e50;">ModernTech HR Login</h2>
      <div v-if="error" style="color: red; margin-bottom: 10px; font-size: 0.9em;">{{ error }}</div>
      <form @submit.prevent="handleLogin">
        <label>Email</label>
        <input v-model="loginForm.email" type="email" required style="width: 100%; padding: 8px; margin: 6px 0 16px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
        <label>Password</label>
        <input v-model="loginForm.password" type="password" required placeholder="Password123!" style="width: 100%; padding: 8px; margin: 6px 0 16px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
        <button type="submit" style="width: 100%; background: #3498db; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">Login to System</button>
      </form>
    </div>

    <!-- MAIN HR DASHBOARD -->
    <div v-else style="max-width: 1100px; margin: 0 auto;">
      <header style="display: flex; justify-content: space-between; align-items: center; background: #2c3e50; color: white; padding: 15px 25px; border-radius: 8px;">
        <h2 style="margin: 0;">ModernTech Solutions HR System</h2>
        <button @click="handleLogout" style="background: #e74c3c; color: white; border: none; padding: 8px 14px; border-radius: 4px; cursor: pointer;">Logout</button>
      </header>

      <!-- Navigation Tabs -->
      <nav style="display: flex; gap: 10px; margin: 20px 0;">
        <button @click="currentTab = 'employees'" :style="{ background: currentTab === 'employees' ? '#3498db' : '#fff', color: currentTab === 'employees' ? '#fff' : '#333' }" style="padding: 10px 20px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-weight: bold;">Employees Directory</button>
        <button @click="currentTab = 'payroll'" :style="{ background: currentTab === 'payroll' ? '#3498db' : '#fff', color: currentTab === 'payroll' ? '#fff' : '#333' }" style="padding: 10px 20px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-weight: bold;">Payroll Calculations</button>
        <button @click="currentTab = 'timeoff'" :style="{ background: currentTab === 'timeoff' ? '#3498db' : '#fff', color: currentTab === 'timeoff' ? '#fff' : '#333' }" style="padding: 10px 20px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-weight: bold;">Time-Off Management</button>
      </nav>

      <div v-if="error" style="background: #ffcccc; color: #a00; padding: 10px; border-radius: 4px; margin-bottom: 15px;">{{ error }}</div>

      <!-- TAB 1: EMPLOYEES DIRECTORY -->
      <section v-if="currentTab === 'employees'">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
          <h3>{{ isEditing ? 'Edit Employee' : 'Add New Employee' }}</h3>
          <form @submit.prevent="saveEmployee" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
            <input v-model="empForm.first_name" type="text" placeholder="First Name" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
            <input v-model="empForm.last_name" type="text" placeholder="Last Name" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
            <input v-model="empForm.email" type="email" placeholder="Work Email" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
            <input v-model="empForm.job_title" type="text" placeholder="Job Title" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
            <select v-model="empForm.department_id" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              <option value="" disabled>Select Department</option>
              <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
            </select>
            <input v-model="empForm.salary" type="number" step="0.01" placeholder="Salary (ZAR)" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
            <input v-model="empForm.hire_date" type="date" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
            <div style="grid-column: span 2; display: flex; gap: 10px;">
              <button type="submit" style="background: #2ecc71; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">{{ isEditing ? 'Update Employee' : 'Save Employee' }}</button>
              <button v-if="isEditing" type="button" @click="resetEmpForm" style="background: #95a5a6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
          </form>
        </div>

        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
          <thead>
            <tr style="background: #ecf0f1; text-align: left;">
              <th style="padding: 12px;">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in employees" :key="emp.id" style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px; font-weight: bold;">{{ emp.first_name }} {{ emp.last_name }}</td>
              <td>{{ emp.email }}</td>
              <td>{{ emp.job_title }}</td>
              <td>{{ emp.department_name }}</td>
              <td>
                <button @click="editEmployee(emp)" style="background: #f39c12; color: white; border: none; padding: 4px 8px; border-radius: 4px; margin-right: 6px; cursor: pointer;">Edit</button>
                <button @click="deleteEmployee(emp.id)" style="background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- TAB 2: PAYROLL -->
      <section v-if="currentTab === 'payroll'">
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
          <h3>Payroll Summary (Persisted Data)</h3>
          <p style="font-size: 1.2em; color: #27ae60; font-weight: bold;">Total Monthly Company Payroll: R{{ totalPayroll.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) }}</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background: #ecf0f1; text-align: left;">
                <th style="padding: 10px;">Employee</th>
                <th>Job Title</th>
                <th>Monthly Salary</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="emp in employees" :key="emp.id" style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">{{ emp.first_name }} {{ emp.last_name }}</td>
                <td>{{ emp.job_title }}</td>
                <td style="font-weight: bold;">R{{ Number(emp.salary).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- TAB 3: TIME-OFF -->
      <section v-if="currentTab === 'timeoff'">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
          <h3>Request Time-Off</h3>
          <form @submit.prevent="submitTimeOff" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            <select v-model="timeOffForm.employee_id" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              <option value="" disabled>Select Employee</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.first_name }} {{ emp.last_name }}</option>
            </select>
            <input v-model="timeOffForm.start_date" type="date" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
            <input v-model="timeOffForm.end_date" type="date" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
            <input v-model="timeOffForm.reason" type="text" placeholder="Reason" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
            <button type="submit" style="grid-column: span 2; background: #3498db; color: white; border: none; padding: 8px; border-radius: 4px; font-weight: bold; cursor: pointer;">Submit Request</button>
          </form>
        </div>

        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
          <thead>
            <tr style="background: #ecf0f1; text-align: left;">
              <th style="padding: 10px;">Employee</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in timeOffRequests" :key="t.id" style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold;">{{ t.employee_name }}</td>
              <td>{{ t.start_date.substring(0, 10) }} to {{ t.end_date.substring(0, 10) }}</td>
              <td>{{ t.reason }}</td>
              <td :style="{ color: t.status === 'approved' ? 'green' : t.status === 'rejected' ? 'red' : 'orange', fontWeight: 'bold' }">{{ t.status.toUpperCase() }}</td>
              <td>
                <button @click="updateTimeOffStatus(t.id, 'approved')" style="background: #2ecc71; color: white; border: none; padding: 4px 8px; border-radius: 4px; margin-right: 4px; cursor: pointer;">Approve</button>
                <button @click="updateTimeOffStatus(t.id, 'rejected')" style="background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>