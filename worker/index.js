const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000,
});

/* Create another Redis client (sub stands for subscription) */
const redisSub = redisClient.duplicate();

function fib(index) {
    if (index < 2) {
        return 1;
    } else {
        return fib(index - 1 ) + fib(index - 2);
    }
}

/* React to all Redis messages that match the 'insert' subscription.
   When that happens, calculate the fib and store it in a hash table
   called 'values' for the index that we found in the 'message' payload */

redisSub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
});
redisSub.subscribe('insert');
