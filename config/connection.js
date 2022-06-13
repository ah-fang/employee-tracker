const mysql = require('mysql2');

require('dotenv').config();

// const db = mysql.createConnection(
//     {
//         host: 'localhost',
//         user: 'root',
//         password: 'database',
//         database: 'election'
//     },
//     console.log("Connected to the election database.")
// );

const db = mysql.createConnection({ Database: process.env.DB_NAME }, () => {

});
module.exports = db;