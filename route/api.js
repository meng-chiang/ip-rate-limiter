const Express = require('express');

const router = Express.Router();

router.get('/v1/test', (req, res) => {
  res.send('Test Rate Limiter');
});

module.exports = router;
