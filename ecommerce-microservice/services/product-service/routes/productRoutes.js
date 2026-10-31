const express = require('express');
const Product = require('../models/Product');
const { nextSequence } = require('../models/Counter');

const router = express.Router();

// CREATE
router.post('/products', async (req, res) => {
  try {
    const { pname, price, quantity } = req.body;
    const pid = await nextSequence('pid');
    const product = await Product.create({ pid, pname, price, quantity });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all
router.get('/products', async (req, res) => {
  res.json(await Product.find().sort({ pid: 1 }));
});

// READ one
router.get('/products/:pid', async (req, res) => {
  const product = await Product.findOne({ pid: parseInt(req.params.pid) });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// UPDATE
router.put('/products/:pid', async (req, res) => {
  try {
    const update = {};
    for (const key of ['pname', 'price', 'quantity']) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    const product = await Product.findOneAndUpdate(
      { pid: parseInt(req.params.pid) },
      update,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete('/products/:pid', async (req, res) => {
  const product = await Product.findOneAndDelete({ pid: parseInt(req.params.pid) });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted successfully' });
});

// RESERVE: trừ tồn kho nguyên tử, chỉ trừ khi còn đủ hàng (Order Service sẽ gọi)
router.post('/products/:pid/reserve', async (req, res) => {
  const qty = parseInt(req.body.qty);
  const pid = parseInt(req.params.pid);
  if (!Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ message: 'qty must be a positive integer' });
  }

  const product = await Product.findOneAndUpdate(
    { pid, quantity: { $gte: qty } },
    { $inc: { quantity: -qty } },
    { new: true }
  );
  if (product) return res.json(product);

  const exists = await Product.exists({ pid });
  if (!exists) return res.status(404).json({ message: 'Product not found' });
  res.status(409).json({ message: 'Not enough stock' });
});

// RELEASE: hoàn lại tồn kho khi đơn thất bại
router.post('/products/:pid/release', async (req, res) => {
  const qty = parseInt(req.body.qty);
  if (!Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ message: 'qty must be a positive integer' });
  }
  const product = await Product.findOneAndUpdate(
    { pid: parseInt(req.params.pid) },
    { $inc: { quantity: qty } },
    { new: true }
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

module.exports = router;
