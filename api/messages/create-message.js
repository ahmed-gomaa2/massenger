const connection = require('../../DB/database');
const auth = require('../../middlewares/auth');
const multer = require('multer');
const path = require('path');
const userHasAccess = require('../../middlewares/userHasAccess');
const multipart = require('parse-multipart-data');
const formidable = require('formidable');
const util = require('util');

const {
    encrypt,
    decrypt,
    encryptFile,
    decryptFile,
    getEncryptedFile,
    saveEncryptedFile,
    getEncryptedFilePath
} = require('../../middlewares/encrypt-messages');


module.exports = (app) => {
    // const storage = multer.diskStorage({
    //     destination: (req, file, cb) => {
    //         // console.log(req.body);
    //         cb(null, 'files/')
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    //     }
    // });

    const storage = multer.memoryStorage();

    const upload = multer({
        storage
    });

    app.post('/create-message/:room_id/:receiver_id', auth,(req, res, next) => {
        userHasAccess(req, res, +req.params.room_id, +req.user, next);
    }, (req, res, next) => {
        userHasAccess(req, res, +req.params.room_id, +req.params.receiver_id, next);
    }, upload.array('files'), (req, res) => {
        const message = req.body;
        const {room_id} = req.params;
        message.hasFiles = message.hasFiles === 'true';
        // console.log(message.hasFiles);

        connection.query('SELECT * FROM rooms WHERE id = ?', room_id, (findRoomError, findRoomRes) => {
            if(findRoomError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHILE FINDING THE ROOM!'}});
            } else if(findRoomRes.length === 0) {
                res.status(401).json({error: {type: 'room', msg: 'THIS ROOM DOESN\'T EVEN EXIST!'}});
            } else {
                const bodyEncrypted = encrypt(message.body);
                // console.log(bodyEncrypted);
                connection.query('INSERT INTO messages (body, sender_id, receiver_id, room_id, create_at, hasFiles) VALUES (?, ?, ?, ?, ?, ?)', [bodyEncrypted, message.sender_id, message.receiver_id, room_id, new Date(), message.hasFiles], (createMessageError, createMessageRes) => {
                    if(createMessageError) {
                        res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHILE CREATING THE MESSAGE!'}});
                    } else {
                        connection.query('UPDATE rooms SET updated_at = ? WHERE id = ?', [new Date(), message.room_id], async (updateRoomError, updatedRoomRes) => {
                            if(updateRoomError) {
                                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHILE UPDATING THE ROOM!'}});
                            } else {
                                if(message.hasFiles) {
                                    const files = [];
                                    req.files.map(async (f, i) => {
                                        // console.log('file uploaded: ', f.originalname, f.filename);
                                        await saveEncryptedFile(f, encryptFile, getEncryptedFilePath, f.buffer, path.join('./files', f.originalname));
                                        if(i === req.files.length - 1) {
                                            files.push(f);
                                            // console.log(files);
                                            const values = [...files.map(f => [`${encrypt(f.data.Location)}`, f.mimetype, f.size, createMessageRes.insertId, f.iv, f.data.Key])];
                                            // console.log(values);
                                            // console.log([...req.files.map(f => [basePath + `${f.filename}`, f.mimetype, f.size, createMessageRes.insertId])])
                                            connection.query('INSERT INTO files (src, fileType, size, message_id, iv, fileKey) VALUES ?', [values], (insertFileError, insertFileRes) => {
                                                if(insertFileError) {
                                                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER!'}})
                                                } else {
                                                    decrypt(values[0][0]);
                                                    const images = [...values.map(v => ({src: decrypt(v[0]), fileType: v[1], size: v[2], message_id: v[3], iv: v[4], fileKey: v[5]}))];
                                                    console.log(images);
                                                    const messageData = {
                                                        id: createMessageRes.insertId,
                                                        room_id: +message.room_id,
                                                        body: message.body,
                                                        receiver_id: +message.receiver_id,
                                                        files: images,
                                                        create_at: new Date(),
                                                        hasFiles: message.hasFiles,
                                                        sender_id: +message.sender_id
                                                    }
                                                    res.status(200).send(messageData);
                                                }
                                            });
                                        }else {
                                            files.push(f);
                                        }
                                    });
                                    // const basePath = 'http://localhost:5000/files/';
                                } else {
                                    const messageData = {
                                        id: createMessageRes.insertId,
                                        room_id: +message.room_id,
                                        body: message.body,
                                        receiver_id: +message.receiver_id,
                                        files: null,
                                        create_at: new Date(),
                                        hasFiles: message.hasFiles,
                                        sender_id: +message.sender_id
                                    }
                                 // res.json({msgId: createMessageRes.insertId});
                                    res.status(200).send(messageData);
                                    // console.log(message);
                                }
                            }
                        });
                    }
                });
            }
        });
    });
}