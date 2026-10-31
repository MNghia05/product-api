const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const Customer = require('./models/Customer');

const PROTO_PATH = path.join(__dirname, '..', '..', 'proto', 'customer.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false, longs: String, enums: String, defaults: true, oneofs: true
});
const customerProto = grpc.loadPackageDefinition(packageDef).customer;

function requireRole(role, allowed) {
  return allowed.includes(role);
}

async function ListCustomers(call, callback) {
  try {
    const role = call.metadata.get('role')[0];
    if (!requireRole(role, ['member', 'admin'])) {
      return callback({ code: grpc.status.PERMISSION_DENIED, message: 'Forbidden: insufficient role' });
    }
    const customers = await Customer.find().sort({ uid: 1 });
    callback(null, { customers: customers.map(c => c.toJSON()) });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

async function GetCustomer(call, callback) {
  try {
    const role = call.metadata.get('role')[0];
    if (!requireRole(role, ['member', 'admin'])) {
      return callback({ code: grpc.status.PERMISSION_DENIED, message: 'Forbidden: insufficient role' });
    }
    const customer = await Customer.findOne({ uid: call.request.uid });
    if (!customer) return callback({ code: grpc.status.NOT_FOUND, message: 'Customer not found' });
    callback(null, customer.toJSON());
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

async function CreateCustomer(call, callback) {
  try {
    const role = call.metadata.get('role')[0];
    if (!requireRole(role, ['admin'])) {
      return callback({ code: grpc.status.PERMISSION_DENIED, message: 'Forbidden: insufficient role' });
    }
    const { uid, fullname, age, address } = call.request;
    const customer = await Customer.create({ uid, fullname, age, address });
    callback(null, customer.toJSON());
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

async function UpdateCustomer(call, callback) {
  try {
    const role = call.metadata.get('role')[0];
    if (!requireRole(role, ['admin'])) {
      return callback({ code: grpc.status.PERMISSION_DENIED, message: 'Forbidden: insufficient role' });
    }
    const { uid, fullname, age, address } = call.request;
    const customer = await Customer.findOneAndUpdate(
      { uid }, { fullname, age, address }, { new: true, runValidators: true }
    );
    if (!customer) return callback({ code: grpc.status.NOT_FOUND, message: 'Customer not found' });
    callback(null, customer.toJSON());
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

async function DeleteCustomer(call, callback) {
  try {
    const role = call.metadata.get('role')[0];
    if (!requireRole(role, ['admin'])) {
      return callback({ code: grpc.status.PERMISSION_DENIED, message: 'Forbidden: insufficient role' });
    }
    const customer = await Customer.findOneAndDelete({ uid: call.request.uid });
    if (!customer) return callback({ code: grpc.status.NOT_FOUND, message: 'Customer not found' });
    callback(null, { success: true, message: 'Customer deleted successfully' });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(customerProto.CustomerService.service, {
    ListCustomers, GetCustomer, CreateCustomer, UpdateCustomer, DeleteCustomer
  });

  const port = process.env.GRPC_PORT || 50052;
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
    if (err) {
      console.error('customer-service gRPC failed to bind:', err.message);
      return;
    }
    console.log(`customer-service gRPC running on port ${boundPort}`);
  });
}

module.exports = startGrpcServer;
