const { timeWindow, threshold } = require('../config/config').rateLimiterConfig;
const client = require('../service/redisClient');
const getReqIP = require('../util/getReqIP');

const rateLimiter = (req, res, next) => {
  const ip = getReqIP(req);
  client
    .multi()
    .set([ip, 0, 'EX', timeWindow, 'NX'])
    .incr(ip)
    .ttl(ip)
    .exec((err, replies) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      const reqCount = replies[1][1];
      const reqResetTime = replies[2][1];

      res.set({
        'X-RateLimit-Remaining': threshold - reqCount,
        'X-RateLimit-Reset': reqResetTime,
      });
      if (reqCount > threshold) {
        return res.status(429).send('Too many connections!');
      }
      return next();
    });
};

module.exports = rateLimiter;
