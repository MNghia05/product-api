const authClient = require('../grpc-clients/authClient');

function authenticate(req, res, next) {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  authClient.VerifyToken({ token }, (err, response) => {
    if (err) return res.status(503).json({ message: 'Auth service unavailable' });
    if (!response.valid) return res.status(403).json({ message: response.message });

    req.user = { uid: response.uid, username: response.username, role: response.role };
    req.token = token;
    next();
  });
}

module.exports = authenticate;
