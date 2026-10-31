const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { mname, score } = req.body;
    const membership = await prisma.memberShip.create({ data: { mname, score } });
    res.status(201).json(membership);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const memberships = await prisma.memberShip.findMany();
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { mname, score } = req.body;
    const membership = await prisma.memberShip.update({
      where: { mid: parseInt(req.params.id) },
      data: { mname, score }
    });
    res.json(membership);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.memberShip.delete({ where: { mid: parseInt(req.params.id) } });
    res.json({ message: 'Membership deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
