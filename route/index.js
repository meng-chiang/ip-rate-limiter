const Express = require('express');
const client = require('../service/redisClient');
const { threshold } = require('../config/config').rateLimiterConfig;
const getReqIP = require('../util/getReqIP');

const router = Express.Router();

function check(count) {
  if (count === null) return '0';
  if (count > threshold) return 'Error';
  return count.toString();
}

router.get('/', (req, res) => {
  const ip = getReqIP(req);
  client.get(ip, (err, replies) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send(check(replies));
  });
});

module.exports = router;
