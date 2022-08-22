const connection = require('../../DB/database');
const auth = require('../../middlewares/auth');

module.exports = app => {
    app.get('/rooms', auth, (req, res) => {
        const userId = req.user;
        connection.query('SELECT * FROM chat_members WHERE user_id = ?', userId, (roomsError, roomsRes) => {
            if(roomsError) {
                return res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER!'}});
            }else if(roomsRes.length === 0){
                return res.status(200).send([]);
            }else {
                let rooms = [];
                roomsRes.map((room, i) => {
                    let thisRoom = {};
                    connection.query('SELECT * FROM rooms WHERE id = ?', room.room_id, (roomError, roomRes) => {
                       if(roomError) {
                           return res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER!'}});
                       }
                       thisRoom = {
                           id: roomRes[0].id,
                           created_at: roomRes[0].create_at,
                           updated_at: roomRes[0].updated_at,
                           current_user: userId,
                           other_user: roomRes[0].creator_id === userId ? roomRes[0].receiver_id : roomRes[0].creator_id,
                           seen: room.seen
                       };

                       rooms.push(thisRoom);
                       if(i === roomsRes.length - 1) {
                           res.send(rooms.sort((a, b) => b.updated_at - a.updated_at ));
                       }
                    });
                });
            }
        })
    });
}