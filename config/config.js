const rateLimiterConfig = {
  timeWindow: process.env.RATE_LIMITER_WINDOW_SEC || 60,
  threshold: process.env.RATE_LIMITER_COUNT || 60,
};

module.exports = {
  rateLimiterConfig,
};
