require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');
const authRoutes = require('./routes/authRoutes');
const startGrpcServer = require('./grpcServer');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', service: 'auth-service' });
  } catch (err) {
    res.status(503).json({ status: 'error', message: err.message });
  }
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`auth-service REST running on port ${PORT}`));

startGrpcServer();
