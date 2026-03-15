const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import routes
const adminRoutes = require('./routes/admin');
const campaignsRoutes = require('./routes/campaigns');
const loansRoutes = require('./routes/loans');
const documentsRoutes = require('./routes/documents');
const notificationsRoutes = require('./routes/notifications');
const sendPromoRoutes = require('./routes/sendPromo');

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bank API is running smoothly.' });
});

// Configure API routes
app.use('/api/admin', adminRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/sendPromo', sendPromoRoutes);

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
