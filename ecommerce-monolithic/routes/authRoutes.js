const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// REGISTER
// REGISTER: tự gán role "normal" và membership score 10
router.post('/register', async (req, res) => {
  try {
    const { username, password, fullname } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Role "normal": có rồi thì dùng, chưa có thì tạo
    let role = await prisma.role.findFirst({ where: { rolename: 'normal' } });
    if (!role) {
      role = await prisma.role.create({ data: { rolename: 'normal' } });
    }

    // Mỗi user mới có 1 membership riêng với score = 10
    const membership = await prisma.memberShip.create({
      data: { mname: 'Normal', score: 10 }
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        fullname,
        roleid: role.roleid,
        mid: membership.mid
      },
      include: { role: true, membership: true }
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { uid: user.uid, username: user.username, roleid: user.roleid },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { uid: user.uid, username: user.username, fullname: user.fullname } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;