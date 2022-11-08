const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res, next) => {
  // QUIZオブジェクトの取得
  const QUIZ_API = 'https://opentdb.com/api.php?amount=10&type=multiple';

  try {
    const response = await fetch(QUIZ_API);
    const data = await response.json()
    res.send(data.results);  
  } catch (error) {
    next(error);
  }
});

module.exports = router;
