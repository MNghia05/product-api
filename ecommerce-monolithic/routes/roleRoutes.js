const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { rolename } = req.body;
    const role = await prisma.role.create({ data: { rolename } });
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { rolename } = req.body;
    const role = await prisma.role.update({
      where: { roleid: parseInt(req.params.id) },
      data: { rolename }
    });
    res.json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.role.delete({ where: { roleid: parseInt(req.params.id) } });
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
