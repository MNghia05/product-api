const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 100,             // tối đa 100 request/phút cho mỗi IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' }
});

module.exports = limiter;
