const express = require('express');
const Customer = require('../models/Customer');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// READ ALL — cần role member (admin cũng có quyền member nên cho qua luôn cả 2)
router.get('/customers', authenticate, authorize('member', 'admin'), async (req, res) => {
  res.json(await Customer.find().sort({ uid: 1 }));
});

// READ ONE — cần role member
router.get('/customers/:uid', authenticate, authorize('member', 'admin'), async (req, res) => {
  const customer = await Customer.findOne({ uid: parseInt(req.params.uid) });
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
});

// CREATE — chỉ admin
router.post('/customers', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { uid, fullname, age, address } = req.body;
    if (!uid || !fullname) {
      return res.status(400).json({ message: 'uid and fullname are required' });
    }
    const customer = await Customer.create({ uid, fullname, age, address });
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE — chỉ admin
router.put('/customers/:uid', authenticate, authorize('admin'), async (req, res) => {
  try {
    const update = {};
    for (const key of ['fullname', 'age', 'address']) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    const customer = await Customer.findOneAndUpdate(
      { uid: parseInt(req.params.uid) },
      update,
      { new: true, runValidators: true }
    );
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE — chỉ admin
router.delete('/customers/:uid', authenticate, authorize('admin'), async (req, res) => {
  const customer = await Customer.findOneAndDelete({ uid: parseInt(req.params.uid) });
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json({ message: 'Customer deleted successfully' });
});

module.exports = router;
