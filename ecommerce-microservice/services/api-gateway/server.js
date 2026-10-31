require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`api-gateway running on port ${PORT}`));
