const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '..', '..', '..', 'proto', 'customer.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false, longs: String, enums: String, defaults: true, oneofs: true
});
const customerProto = grpc.loadPackageDefinition(packageDef).customer;

const client = new customerProto.CustomerService(
  process.env.CUSTOMER_GRPC_URL,
  grpc.credentials.createInsecure()
);

module.exports = client;
