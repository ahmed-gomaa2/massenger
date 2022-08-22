const connection = require('../../DB/database');
const auth = require("../../middlewares/auth");

module.exports = app => {
    app.post('/create-room', auth, (req, res) => {
        const data = req.body;
        console.log(req.body);
        connection.query('INSERT INTO rooms (creator_id, receiver_id) values (?, ?)', [data.current_user, data.other_user], (createRoomError, createRoomRes) => {
            if(createRoomError) {
                return res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH SQL SERVER!'}});
            } else {
                const sql = 'INSERT INTO chat_members (room_id, user_id) values ?';
                const values = [
                    [createRoomRes.insertId, data.current_user],
                    [createRoomRes.insertId, data.other_user]
                ]
                console.log(createRoomRes.insertId);
                connection.query(sql, [values], (chatMembersError, chatMembersRes) => {
                    if(chatMembersError) {
                        return res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER!'}});
                    } else {
                        res.send({room: createRoomRes.insertId});
                    }
                });
            }
        });
    });
}