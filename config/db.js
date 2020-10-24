const redisInfo = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PWD || '',
  db: 0,
};

module.exports = {
  redisInfo,
};
