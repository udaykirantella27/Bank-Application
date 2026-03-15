const express = require('express');
const router = express.Router();

router.post('/apply', (req, res) => {
  res.json({ message: 'Loan application submitted successfully (Mock Endpoint)' });
});

router.get('/', (req, res) => {
  res.json({ message: 'Loans route connected' });
});

module.exports = router;
