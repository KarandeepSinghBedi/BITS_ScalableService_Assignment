const express = require('express');
const app = express();
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');

app.use(express.json());
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
