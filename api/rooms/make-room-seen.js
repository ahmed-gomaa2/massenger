const connection = require('../../DB/database');
const auth = require('../../middlewares/auth');

module.exports = app => {
    app.put('/room-seen/:room_id/:user_id', auth, (req, res) => {
        const {room_id} = req.params;
        const {user_id} = req.params;
        connection.query('SELECT * FROM chat_members WHERE room_id = ? AND user_id = ?', [room_id, user_id], (findRoomError, findRoomRes) => {
            if(findRoomError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WIT THE SQL SERVER WHILE FINDING THE ROOM!'}});
            }else if(findRoomRes.length ===0) {
                res.status(401).json({error: {type: 'server', msg: 'THIS ROOM DOESN\'T EVEN EXIST!'}});
            }else {
                connection.query('UPDATE chat_members SET seen = 1 WHERE room_id = ? AND user_id = ?', [room_id, user_id], (setSeenError, setSeenRes) => {
                    if(setSeenError) {
                        res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHEN UPDATING THE ROOM!'}});
                    }else {
                        res.status(200).send(setSeenRes);
                    }
                });
            }
        })
    });
}