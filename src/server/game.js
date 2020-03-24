const rooms = {};

const playerColors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00"
];

function getRandomColor() {
    const idx = Math.floor(Math.random() * Math.floor(playerColors.length));
    return playerColors[idx];
}

function createPlayer(socketId, login) {
    return {
        socketId,
        login,
        color: getRandomColor(),
        active: true
    };
}

function createRoom(id) {
    return {
        id,
        players: {},
        cards: {}
    };
}

module.exports = function game(io) {
    const game = io.of('/game').on('connection', function (socket) {
        socket.on('join', function ({room, login}) {
            console.log('join', room, login);

            if (!rooms[room]) {
                rooms[room] = createRoom(room);
            }

            socket.room = room;
            socket.login = login;
            socket.join(room);
            if (!rooms[room].players[login]) {
                rooms[room].players[login] = createPlayer(socket.id, login);
            }
            game.to(room).emit('player-joined', rooms[room].players[login]);
            socket.emit('status', rooms[room]);
        });

        socket.on('disconnecting', function (reason) {
            if (!rooms[socket.room] || !rooms[socket.room].players[socket.login]) {
                return;
            }

            rooms[socket.room].players[socket.login].active = false;

            game.to(socket.room).emit('player-left', {login: socket.login, reason});
            sendStatus(socket.room);
        });

        socket.on('move-player', function ({login, position, rotation}) {
            if (!rooms[socket.room] || !rooms[socket.room].players[login]) {
                return;
            }

            rooms[socket.room].players[login].position = position;
            rooms[socket.room].players[login].rotation = rotation;
            // sendStatus(socket.room, false, login);
            sendMove(socket.room, login);
        });

        function sendMove(room, login) {
            game.volatile.to(room).emit('status-move', rooms[room].players[login]);
        }

        function sendStatus(room, includeSelf = false) {
            game.volatile.to(room).emit('status', rooms[room]);
        }
    });

    return game;
}
