const Redis = require('ioredis');
const { redisInfo } = require('../config/db');

const client = new Redis(redisInfo);

// log/handle error
client.on('error', err => console.log(`Error ${err}`));

module.exports = client;
