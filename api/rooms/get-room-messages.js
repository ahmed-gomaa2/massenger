const connection = require('../../DB/database');
const auth = require('../../middlewares/auth');
const userHasAccess = require('../../middlewares/userHasAccess');
const {
    encrypt,
    decrypt,
    encryptFile,
    decryptFile,
    getEncryptedFile,
    saveEncryptedFile,
    getEncryptedFilePath
} = require('../../middlewares/encrypt-messages');


module.exports = app => {
    app.get('/get-room-messages/:id', auth, (req, res, next) => {
        userHasAccess(req, res, req.params.id, req.user, next);
    }, async (req, res) => {
        const room_id = req.params.id;
        const {user} = req;
        try {
            connection.query('SELECT * FROM rooms WHERE id = ?', room_id, (findRoomError, findRoomRes) => {
                if(findRoomError) {
                    res.status(500).josn({error: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHEN TRYING TO GET ROOM!'});
                }else if(findRoomRes.length === 0 ) {
                    res.status(401).json({error: 'room', msg:'THIS ROOM DOESN\'T EVENT EXIST!'});
                }else {
                    // connection.query('SELECT * FROM chat_members WHERE room_id = ? AND user_id = ?', [room_id, user], (userExistsError, userExistsRes) => {
                    //     if(userExistsError) {
                    //         res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHILE CHECKING IF THE USER HAS ACCESS TO THIS ROOM!'}})
                    //     }else if(userExistsRes.length === 0){
                    //         res.status(400).json({error: {type: 'user', msg: 'THIS USER DOESN\'T HAVE ACCESS TO THIS ROOM!'}})
                    //     }else {
                            connection.query('SELECT * FROM messages WHERE room_id = ? ORDER BY id DESC LIMIT 10', room_id, (getMessagesError, getMessagesRes) => {
                                if(getMessagesError) {
                                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHEN TRYING TO GET MESSAGES!'}})
                                } else if(getMessagesRes.length === 0) {
                                    res.status(200).send([]);
                                }else {
                                    // res.status(200).send(getMessagesRes);
                                    let messages = [];
                                    getMessagesRes.map(async (m, i)=> {
                                        // if(m.hasFiles) {
                                        console.log(m.hasFiles);
                                        await connection.query('SELECT * FROM files WHERE message_id = ?', m.id, (fetchFilesError, fetchFilesRes) => {
                                            if(fetchFilesError) {
                                                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER!'}})
                                            }else {
                                                console.log(fetchFilesRes)
                                                m.files = [...fetchFilesRes.map((f, i) => {
                                                    f.src = decrypt(f.src);
                                                    return f;
                                                })];

                                                m.body = decrypt(m.body);

                                                messages.push(m);
                                                // console.log(m.files);
                                                if(i === getMessagesRes.length - 1) {
                                                    // console.log(messages);
                                                    res.status(200).send(messages);
                                                }
                                            }
                                        });
                                        // }else {
                                        //     messages.push(m);
                                        //     if(i === getMessagesRes.length - 1) {
                                        //         // console.log(m);
                                        //         res.status(200).send(messages);
                                        //         // console.log(messages);
                                        //     }
                                        // }
                                    });
                                }
                            });

                    //     }
                    // });
                }
            })
        }catch (err) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH TEH SERVER!'}});
        }
    });

    app.get('/load-more-messages/:room_id/:start_id', auth, (req, res, next) => {
        userHasAccess(req, res, req.params.room_id,req.user, next);
    }, (req, res) => {
        // console.log(req.room_id)
        const {start_id, room_id} = req.params;
        const {user} = req;
        // console.log(room_id)
        connection.query('SELECT * FROM rooms WHERE id = ?', room_id, (findRoomError, findRoomRes) => {
            if(findRoomError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHILE TRYING TO FIND THE RIGHT ROOM!'}});
            } else if(findRoomRes.length === 0) {
                res.status(401).json({error: {type: 'room', msg: 'THIS ROOM DOESN\'T EVEN EXIST!'}});
            }else {
                // connection.query('SELECT * FROM chat_members WHERE room_id = ? AND user_id = ?', [room_id, user], (userExistsError, userExistsRes) => {
                //     if(userExistsError) {
                //         res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH SQL SERVER WHILE CHECKING IF THE USER HAS ACCESS TO THIS ROOM!'}})
                //     }else if(userExistsRes.length === 0) {
                //         res.status(400).json({error: {type: 'user', msg: 'THE USER DOESN\'T HAVE ACCESS TO THIS ROOM!'}})
                //     }else {
                        connection.query('SELECT * FROM messages WHERE room_id = ? AND id < ? ORDER BY id desc LIMIT 10', [+room_id, +start_id], (getMoreMessagesError, getMoreMessagesRes) => {
                            if(getMoreMessagesError) {
                                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHILE GETTING MORE MESSAGES!'}});
                            } else if(getMoreMessagesRes.length === 0) {
                                res.status(200).json({messages: [], more: false});
                            }else if(getMoreMessagesRes.length < 10) {
                                const messages = [];
                                console.log(getMoreMessagesRes.length)
                                getMoreMessagesRes.map((m, i) => {
                                    // if(m.hasFiles) {
                                    // console.log(m.hasFiles);
                                    connection.query('SELECT * FROM files WHERE message_id = ?', m.id, (fetchFilesError, fetchFilesRes) => {
                                        if (fetchFilesError) {
                                            res.status(500).json({
                                                error: {
                                                    type: 'server',
                                                    msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER!'
                                                }
                                            });
                                        } else {
                                            // console.log(fetchFilesRes)
                                            m.files = [...fetchFilesRes.map((f, i) => {
                                                f.src = decrypt(f.src);
                                                return f;
                                            })];
                                            m.body = decrypt(m.body);
                                            messages.push(m);
                                            // console.log(m.files);
                                            if (i === getMoreMessagesRes.length - 1) {
                                                // console.log(messages);
                                                res.status(200).json({messages, more: false});
                                            }
                                        }
                                    });
                                    // }else {
                                    //     messages.push(m);
                                    //     if(i === getMoreMessagesRes.length - 1) {
                                    //         // console.log(m);
                                    //         res.status(200).json({messages, more: false});
                                    //     }
                                    // }

                                });
                            } else {
                                let messages = [];
                                console.log(getMoreMessagesRes.length);
                                // if(m.hasFiles) {
                                getMoreMessagesRes.map((m, i) => {
                                    // console.log(m.hasFiles);
                                    connection.query('SELECT * FROM files WHERE message_id = ?', m.id, (fetchFilesError, fetchFilesRes) => {
                                        if(fetchFilesError) {
                                            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER!'}})
                                        }else {
                                            // console.log(fetchFilesRes)
                                            m.files = [...fetchFilesRes.map((f, i) => {
                                                f.src = decrypt(f.src);
                                                return f;
                                            })];
                                            m.body = decrypt(m.body);
                                            messages.push(m);
                                            // console.log(m.files);
                                            if(i === getMoreMessagesRes.length - 1) {
                                                // console.log(messages);
                                                res.status(200).json({messages: messages, more: true})
                                            }
                                        }
                                    });
                                });

                                // }else {
                                //     messages.push(m);
                                //     if(i === getMoreMessagesRes.length - 1) {
                                //         // console.log(m);
                                //         res.status(200).json({messages: messages, more: true})
                                //     }
                                // }

                            // }
                        // });
                    }
                });

            }
        });
    });

    // app.get('/get-room-messages/:id', auth, async (req, res) => {
    //     const room_id = req.params.id;
    //     try {
    //         connection.query('SELECT * FROM rooms WHERE id = ?', room_id, (findRoomError, findRoomRes) => {
    //             if(findRoomError) {
    //                 res.status(500).josn({error: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHEN TRYING TO GET ROOM!'});
    //             }else if(findRoomRes.length === 0 ) {
    //                 res.status(401).json({error: 'room', msg:'THIS ROOM DOESN\'T EVENT EXIST!'});
    //             }else {
    //                 connection.query('SELECT * FROM messages WHERE room_id = ? ORDER BY id DESC LIMIT 10', room_id, (getMessagesError, getMessagesRes) => {
    //                     if(getMessagesError) {
    //                         res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHEN TRYING TO GET MESSAGES!'}})
    //                     } else if(getMessagesRes.length === 0) {
    //                         res.status(200).send([]);
    //                     }else {
    //                         // res.status(200).send(getMessagesRes);
    //                         let messages = [];
    //                         getMessagesRes.map(async (m, i)=> {
    //                              // if(m.hasFiles) {
    //                                  console.log(m.hasFiles);
    //                                  await connection.query('SELECT * FROM files WHERE message_id = ?', m.id, (fetchFilesError, fetchFilesRes) => {
    //                                      if(fetchFilesError) {
    //                                          res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER!'}})
    //                                      }else {
    //                                          console.log(fetchFilesRes)
    //                                          m.files = [...fetchFilesRes];
    //                                          messages.push(m);
    //                                          // console.log(m.files);
    //                                          if(i === getMessagesRes.length - 1) {
    //                                              // console.log(messages);
    //                                              res.status(200).send(messages);
    //                                          }
    //                                      }
    //                                  });
    //                              // }else {
    //                              //     messages.push(m);
    //                              //     if(i === getMessagesRes.length - 1) {
    //                              //         // console.log(m);
    //                              //         res.status(200).send(messages);
    //                              //         // console.log(messages);
    //                              //     }
    //                              // }
    //                         });
    //                     }
    //                 });
    //             }
    //         })
    //     }catch (err) {
    //         res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH TEH SERVER!'}});
    //     }
    // });
    //
    // app.get('/load-more-messages/:room_id/:start_id', auth, (req, res) => {
    //     const {start_id, room_id} = req.params;
    //     console.log(room_id)
    //     connection.query('SELECT * FROM rooms WHERE id = ?', room_id, (findRoomError, findRoomRes) => {
    //         if(findRoomError) {
    //             res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHILE TRYING TO FIND THE RIGHT ROOM!'}});
    //         } else if(findRoomRes.length === 0) {
    //             res.status(401).json({error: {type: 'room', msg: 'THIS ROOM DOESN\'T EVEN EXIST!'}});
    //         }else {
    //             connection.query('SELECT * FROM messages WHERE room_id = ? AND id < ? AND id >= ? ORDER BY id desc LIMIT 10', [room_id, start_id, start_id - 10], (getMoreMessagesError, getMoreMessagesRes) => {
    //                 if(getMoreMessagesError) {
    //                     res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER WHILE GETTING MORE MESSAGES!'}});
    //                 } else if(getMoreMessagesRes.length === 0) {
    //                     res.status(200).json({messages: [], more: false});
    //                 }else if(getMoreMessagesRes.length < 10){
    //                     const messages = [];
    //                     getMoreMessagesRes.map((m, i) => {
    //                         if(m.hasFiles) {
    //                             console.log(m.hasFiles);
    //                             connection.query('SELECT * FROM files WHERE message_id = ?', m.id, (fetchFilesError, fetchFilesRes) => {
    //                                 if(fetchFilesError) {
    //                                     res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER!'}})
    //                                 }else {
    //                                     // console.log(fetchFilesRes)
    //                                     m.files = [...fetchFilesRes];
    //                                     messages.push(m);
    //                                     // console.log(m.files);
    //                                     if(i === getMoreMessagesRes.length - 1) {
    //                                         // console.log(messages);
    //                                         res.status(200).json({messages, more: false});
    //                                     }
    //                                 }
    //                             });
    //                         }else {
    //                             messages.push(m);
    //                             if(i === getMoreMessagesRes.length - 1) {
    //                                 // console.log(m);
    //                                 res.status(200).json({messages, more: false});
    //                             }
    //                         }
    //
    //                     });
    //                 }else {
    //                     let messages = [];
    //                     if(m.hasFiles) {
    //                         console.log(m.hasFiles);
    //                         connection.query('SELECT * FROM files WHERE message_id = ?', m.id, (fetchFilesError, fetchFilesRes) => {
    //                             if(fetchFilesError) {
    //                                 res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SQL SERVER!'}})
    //                             }else {
    //                                 // console.log(fetchFilesRes)
    //                                 m.files = [...fetchFilesRes];
    //                                 messages.push(m);
    //                                 // console.log(m.files);
    //                                 if(i === getMoreMessagesRes.length - 1) {
    //                                     // console.log(messages);
    //                                     res.status(200).json({messages: messages, more: true})
    //                                 }
    //                             }
    //                         });
    //                     }else {
    //                         messages.push(m);
    //                         if(i === getMoreMessagesRes.length - 1) {
    //                             // console.log(m);
    //                             res.status(200).json({messages: messages, more: true})
    //                         }
    //                     }
    //
    //                 }
    //             });
    //         }
    //     });
    // });
}