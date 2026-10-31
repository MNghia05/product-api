const express = require('express');
const grpc = require('@grpc/grpc-js');
const customerClient = require('../grpc-clients/customerClient');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

function metaFor(req) {
  const meta = new grpc.Metadata();
  meta.add('role', req.user.role);
  return meta;
}

function handleGrpcError(err, res) {
  const map = { 5: 404, 7: 403, 6: 400 }; // NOT_FOUND, PERMISSION_DENIED, ALREADY_EXISTS
  res.status(map[err.code] || 500).json({ message: err.details || err.message });
}

router.get('/', authenticate, (req, res) => {
  customerClient.ListCustomers({}, metaFor(req), (err, response) => {
    if (err) return handleGrpcError(err, res);
    res.json(response.customers);
  });
});

router.get('/:uid', authenticate, (req, res) => {
  customerClient.GetCustomer({ uid: parseInt(req.params.uid) }, metaFor(req), (err, response) => {
    if (err) return handleGrpcError(err, res);
    res.json(response);
  });
});

router.post('/', authenticate, (req, res) => {
  const { uid, fullname, age, address } = req.body;
  customerClient.CreateCustomer({ uid, fullname, age, address }, metaFor(req), (err, response) => {
    if (err) return handleGrpcError(err, res);
    res.status(201).json(response);
  });
});

router.put('/:uid', authenticate, (req, res) => {
  const { fullname, age, address } = req.body;
  customerClient.UpdateCustomer(
    { uid: parseInt(req.params.uid), fullname, age, address },
    metaFor(req),
    (err, response) => {
      if (err) return handleGrpcError(err, res);
      res.json(response);
    }
  );
});

router.delete('/:uid', authenticate, (req, res) => {
  customerClient.DeleteCustomer({ uid: parseInt(req.params.uid) }, metaFor(req), (err, response) => {
    if (err) return handleGrpcError(err, res);
    res.json({ message: response.message });
  });
});

module.exports = router;
