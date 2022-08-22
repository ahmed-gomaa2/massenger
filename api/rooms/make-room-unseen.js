const connection = require('../../DB/database');
const auth = require('../../middlewares/auth');

module.exports = app => {
    app.put('/unseen-room/:room_id/:user_id', auth, (req, res) => {
        const {room_id, user_id} = req.params;

        connection.query('UPDATE chat_members SET seen = FALSE WHERE room_id = ? AND user_id = ?', [room_id, user_id], (updatedRoomError, updatedRoomRes) => {
            if(updatedRoomError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHILE UPDATING THE USER SEEN!'}});
            }else {
                res.json(updatedRoomRes);
            }
        });
    });
}