module.exports = (app, io) => {
    io.on('connection', (socket) => {
        console.log('user connected with an id: ' + socket.id);
        socket.on('join_room', (data) => {
            socket.join(data);
            console.log(`USER WIT ID: ${socket.id} JOINED ROOM: ${data}`);
        });

        socket.on('send_message', data => {
            // console.log(data, data.room_id);
            socket.to(data.room_id).emit('receive_message', data, () => {
                console.log('Message is going!')
            });
        });

        socket.on('create_new_room', data => {
            // console.log(data);
            socket.broadcast.emit('create_new_room_with_me', data);
        });

        socket.on('create_new_user', data => {
            // console.log(data);
            socket.broadcast.emit('receive_new_user', data);
        });

        socket.on('disconnect', () => {
            console.log(`USER WITH ID: ${socket.id} DISCONNECTED`);
        });
    });
}