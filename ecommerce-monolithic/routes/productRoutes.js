const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/authMiddleware');

// CREATE
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { pname, price, quantity } = req.body;
    const product = await prisma.product.create({
      data: { pname, price, quantity }
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ one
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { pid: parseInt(req.params.id) }
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { pname, price, quantity } = req.body;
    const product = await prisma.product.update({
      where: { pid: parseInt(req.params.id) },
      data: { pname, price, quantity }
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.product.delete({ where: { pid: parseInt(req.params.id) } });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;