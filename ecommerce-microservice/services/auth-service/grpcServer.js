const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('./lib/prisma');

const PROTO_PATH = path.join(__dirname, '..', '..', 'proto', 'auth.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false, longs: String, enums: String, defaults: true, oneofs: true
});
const authProto = grpc.loadPackageDefinition(packageDef).auth;

const tokenBlacklist = new Set();

async function Register(call, callback) {
  try {
    const { username, password, role } = call.request;
    const finalRole = role && ['member', 'admin'].includes(role) ? role : 'member';

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return callback({ code: grpc.status.ALREADY_EXISTS, message: 'Username already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { username, password: hashed, role: finalRole } });
    callback(null, { uid: user.uid, username: user.username, role: user.role });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

async function Login(call, callback) {
  try {
    const { username, password } = call.request;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return callback({ code: grpc.status.UNAUTHENTICATED, message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { uid: user.uid, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    callback(null, { token, user: { uid: user.uid, username: user.username, role: user.role } });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

function Logout(call, callback) {
  const { token } = call.request;
  if (!token) return callback({ code: grpc.status.UNAUTHENTICATED, message: 'No token provided' });
  tokenBlacklist.add(token);
  callback(null, { success: true, message: 'Logged out successfully' });
}

function VerifyToken(call, callback) {
  const { token } = call.request;
  if (!token) {
    return callback(null, { valid: false, uid: 0, username: '', role: '', message: 'No token provided' });
  }
  if (tokenBlacklist.has(token)) {
    return callback(null, { valid: false, uid: 0, username: '', role: '', message: 'Token has been logged out' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return callback(null, { valid: false, uid: 0, username: '', role: '', message: 'Invalid or expired token' });
    }
    callback(null, { valid: true, uid: decoded.uid, username: decoded.username, role: decoded.role, message: 'ok' });
  });
}

function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(authProto.AuthService.service, {
    Register, Login, Logout, VerifyToken
  });

  const port = process.env.GRPC_PORT || 50051;
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
    if (err) {
      console.error('auth-service gRPC failed to bind:', err.message);
      return;
    }
    console.log(`auth-service gRPC running on port ${boundPort}`);
  });
}

module.exports = startGrpcServer;
