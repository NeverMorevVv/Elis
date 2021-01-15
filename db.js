const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'never',
    password: '1234567890',
    database: 'dataBase',
});

module.exports = pool;
