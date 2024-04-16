const {createClient} = require("redis");

const redisClient = createClient({
    url: 'redis://default:bSJp40Itd2Tctf07@redis'
});

redisClient.connect().then(r => {
    console.log('Connection to Redis done successfully')
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));

module.exports = redisClient;