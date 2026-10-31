const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/authMiddleware');

// CREATE shipment cho 1 order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { oid, status } = req.body;

    const order = await prisma.order.findUnique({ where: { oid } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const shipment = await prisma.shipment.create({
      data: { oid, status: status || 'PENDING' }
    });
    res.status(201).json(shipment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all shipments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const shipments = await prisma.shipment.findMany();
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ shipment theo order
router.get('/order/:oid', authMiddleware, async (req, res) => {
  try {
    const shipments = await prisma.shipment.findMany({
      where: { oid: parseInt(req.params.oid) }
    });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE trạng thái giao hàng
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const shipment = await prisma.shipment.update({
      where: { shipid: parseInt(req.params.id) },
      data: { status }
    });
    res.json(shipment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
