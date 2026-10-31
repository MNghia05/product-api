require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const roleRoutes = require('./routes/roleRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shipments', shipmentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Ecommerce Monolithic API is running' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
