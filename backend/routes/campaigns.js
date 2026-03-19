const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const historyPath = path.join(process.cwd(), 'data', 'history.json');
  
  if (fs.existsSync(historyPath)) {
    const data = fs.readFileSync(historyPath, 'utf8');
    res.json(JSON.parse(data || '[]'));
  } else {
    res.json([]);
  }
});

module.exports = router;
