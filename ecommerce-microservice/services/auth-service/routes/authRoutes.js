const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const router = express.Router();

// Blacklist token đã logout — lưu tạm trong RAM, đủ dùng cho demo/bài tập
const tokenBlacklist = new Set();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, password, role = 'member' } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }
    if (!['member', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'role must be member or admin' });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(400).json({ message: 'Username already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { username, password: hashed, role } });

    res.status(201).json({ uid: user.uid, username: user.username, role: user.role });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { uid: user.uid, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, user: { uid: user.uid, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGOUT — thêm token vào blacklist
router.post('/logout', (req, res) => {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  tokenBlacklist.add(token);
  res.json({ message: 'Logged out successfully' });
});

// VERIFY — dùng nội bộ (Gateway sẽ gọi hoặc dùng cùng JWT_SECRET để tự verify)
router.get('/verify', (req, res) => {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  if (tokenBlacklist.has(token)) return res.status(401).json({ message: 'Token has been logged out' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    res.json(decoded);
  });
});

module.exports = router;
