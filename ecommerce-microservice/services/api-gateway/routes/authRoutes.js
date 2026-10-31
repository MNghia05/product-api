const express = require('express');
const authClient = require('../grpc-clients/authClient');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  authClient.Register({ username, password, role: role || '' }, (err, response) => {
    if (err) return res.status(err.code === 6 ? 400 : 500).json({ message: err.details || err.message });
    res.status(201).json(response);
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  authClient.Login({ username, password }, (err, response) => {
    if (err) return res.status(401).json({ message: err.details || 'Invalid username or password' });
    res.json(response);
  });
});

router.post('/logout', authenticate, (req, res) => {
  authClient.Logout({ token: req.token }, (err, response) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: response.message });
  });
});

module.exports = router;
