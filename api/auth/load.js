const connection = require('../../DB/database');
const auth = require('../../middlewares/auth');

module.exports = (app) => {
    app.get('/get-user', auth, async (req, res) => {
        try {
            const id = req.user;
            console.log(id);
            await connection.query('SELECT * FROM users WHERE id = ?', id, (getUserError, getUserRes) => {
               if(getUserError) {
                   res.status(500).josn({eror: {type: 'server', msg: 'SOMETHING WENT WRONG THE SQL SERVER!'}});
               } else if(getUserRes.length ===0) {
                   res.status(400).json({error: {type: 'user', msg: 'THERE\'S NO USER WITH THIS ID!'}})
               }else{
                   res.send(getUserRes[0]);
               }
            });
        }catch(err) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}});
        }
    });
}