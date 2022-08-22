const connection = require('../DB/database');
const FormData = require('form-data');


module.exports = (req, res, room_id, user, next) => {
    // console.log(user, req.body);
    connection.query('SELECT * FROM chat_members WHERE room_id = ? AND user_id = ?', [+room_id, +user], (userExistsError, userExistsRes) => {
        if(userExistsError) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH SQL SERVER WHILE CHECKING IF THE USER HAS ACCESS TO THIS ROOM!'}})
        }else if(userExistsRes.length === 0) {
            res.status(400).json({error: {type: 'user', msg: `USER ${user} DOESN\'T HAVE ACCESS TO THIS ROOM!`}})
        }else {
            // if(req.body) {
            //     console.log(req.body);
            //     const formData = new FormData();
            //     formData.append('room_id', +req.body.room_id);
            //     formData.append('body', req.body.body);
            //     formData.append('receiver_id', req.body.receiver_id);
            //     formData.append('sender_id', req.body.sender_id);
            //     req.body.files.map(f => formData.append('files', f));
            //     formData.append('hasFiles', req.body.hasFiles);
            //
            //     req.body = formData;
            // }
            next();
        }
    });
}