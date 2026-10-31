require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const customerRoutes = require('./routes/customerRoutes');
const startGrpcServer = require('./grpcServer');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', customerRoutes);

app.get('/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'error',
    service: 'customer-service'
  });
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3002;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`customer-service REST running on port ${PORT}`));
    startGrpcServer();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
