const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    password: keys.pgPassword,
    host: keys.pgHost,
    database: keys.pgDatabase,
    port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));

// First time we connect, create the table we need to store the indices we fib'ed before
pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.log(err));

// Redis Client Setup
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000,
});
const redisPub = redisClient.duplicate();

// Express Route Handlers
app.get('/', (req, res) => {
    res.send('Hi');
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows)
})
