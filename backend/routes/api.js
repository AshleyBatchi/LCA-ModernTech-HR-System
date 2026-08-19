const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const authCtrl = require('../controllers/authController');
const empCtrl = require('../controllers/employeeController');
const deptCtrl = require('../controllers/departmentController');
const timeOffCtrl = require('../controllers/timeOffController');

router.post('/auth/login', authCtrl.login);
router.get('/departments', authMiddleware, deptCtrl.getDepartments);
router.get('/employees', authMiddleware, empCtrl.getEmployees);
router.post('/employees', authMiddleware, empCtrl.createEmployee);
router.put('/employees/:id', authMiddleware, empCtrl.updateEmployee);
router.delete('/employees/:id', authMiddleware, empCtrl.deleteEmployee);
router.get('/time-off', authMiddleware, timeOffCtrl.getAllRequests);
router.post('/time-off', authMiddleware, timeOffCtrl.createRequest);
router.patch('/time-off/:id/status', authMiddleware, timeOffCtrl.updateStatus);

module.exports = router;