const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'sql6.freesqldatabase.com',
    user     : 'sql6514458',
    password : 'B5bXWUlavT',
    database : 'sql6514458',
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