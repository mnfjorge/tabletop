const rooms = {};

function createRoom(id) {
    return {
        id,
        players: {},
        messages: []
    };
}

module.exports = function chat(io) {
    const chat = io.of('/chat').on('connection', function (socket) {
        socket.on('join', function ({room, login}) {
            console.log('join', room, login);

            if (!rooms[room]) {
                rooms[room] = createRoom(room);
            }

            socket.room = room;
            socket.login = login;
            socket.join(room);
            chat.to(room).emit('chat-joined', {room, login});
            socket.emit('history', rooms[room].messages);
        });

        socket.on('message', function (data) {
            console.log('message', socket.room, data);

            const message = {text: data.text, login: socket.login};
            rooms[socket.room].messages.push(message);

            chat.to(socket.room).emit('message', message);
        });

        socket.on('disconnecting', function (reason) {
            if (!rooms[socket.room]) {
                return;
            }

            chat.to(socket.room).emit('chat-left', {login: socket.login, reason});
        });
    });

    return chat;
};
