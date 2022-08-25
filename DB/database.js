const mysql = require('mysql');
<<<<<<< HEAD

const connection = mysql.createConnection({
    host     : 'sql6.freesqldatabase.com',
    user     : 'sql6514458',
    password : 'B5bXWUlavT',
    database : 'sql6514458',
=======
require('dotenv').config('../.env')

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DB_NAME,
>>>>>>> a6d3ab6f1f44c86ec3094e58ced82311bea803e7
    debug    :  true,
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