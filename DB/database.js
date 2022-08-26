const mysql = require('mysql');
require('dotenv').config('../.env');

console.log(process.env.DB_host);

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DB_NAME,
    debug    :  false,
    logging: true
});

// const connection = mysql.createConnection({
//     host     : 'sql6.freesqldatabase.com',
//     user     : 'sql6514458',
//     password : 'B5bXWUlavT',
//     database : 'sql6514458',
//     debug    :  true,
//     logging: true
// });
//
connection.connect(err => {
    if(err) console.log(err);
});

module.exports = connection;