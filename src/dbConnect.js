require('dotenv').config();

const pgp = require('pg-promise')();
const dbOptions = {
    host: process.env.HOST,
    port: 5432,
    database: process.env.DB,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    poolSize: 10
};

const db = pgp(dbOptions);

module.exports = { db, pgp };