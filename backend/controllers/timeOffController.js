const TimeOff = require('../models/timeOffModel');

exports.getAllRequests = async (req, res) => {
    try {
        const data = await TimeOff.getAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve time off requests.' });
    }
};

exports.createRequest = async (req, res) => {
    try {
        const { employee_id, start_date, end_date, reason } = req.body;
        if (!employee_id || !start_date || !end_date || !reason) {
            return res.status(400).json({ error: 'All time-off fields are required.' });
        }
        const created = await TimeOff.create(req.body);
        res.status(201).json(created);
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit time off request.' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status update.' });
        }
        const updated = await TimeOff.updateStatus(req.params.id, status);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update request status.' });
    }
};