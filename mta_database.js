const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '51.75.44.14',
    port: 3306,
    user: 'gs106245',
    password: 'r3n8mxaq',
    database: 'gs106245',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;
