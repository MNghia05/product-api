const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '..', '..', '..', 'proto', 'auth.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false, longs: String, enums: String, defaults: true, oneofs: true
});
const authProto = grpc.loadPackageDefinition(packageDef).auth;

const client = new authProto.AuthService(
  process.env.AUTH_GRPC_URL,
  grpc.credentials.createInsecure()
);

module.exports = client;
