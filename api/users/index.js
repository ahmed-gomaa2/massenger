const connection = require('../../DB/database');
const auth = require('../../middlewares/auth');

module.exports = app => {
    app.get('/fetch-users', auth, (req, res) => {
        connection.query('SELECT id, username FROM users', (fetchUsersError, fetchUsersRes) => {
            if(fetchUsersError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH TEH SQL SERVER!'}});
            } else {
                res.send(fetchUsersRes);
            }
        });
    });
}