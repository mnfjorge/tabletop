import io from 'socket.io-client';
import game from '../utils/game';

class ChatSocket {
    constructor() {
        this.listeners = [];

        this.socket = io.connect('/chat');
        this.socket.on('connect', socket => {
            this.socket.emit('join', {room: game.getGameId(), login: game.getLogin()});
        });

        this.socket.on('chat-joined', (data) => {
            this.onMessage("\n" + data.login + ' joined');
        });
        this.socket.on('chat-left', (data) => {
            this.onMessage("\n" + data.login + ' left');
        });
        this.socket.on('message', (data) => {
            this.onMessage("\n" + data.login + ': ' + data.text);
        });
    }

    onMessage(message) {
        this.listeners.forEach(listener => {
            listener(message);
        });
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    send(text) {
        this.socket.emit('message', {text});
    }
}

export const chatSocket = new ChatSocket();
