require('dotenv').config();
const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('CoinTrader AI Payment System');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});