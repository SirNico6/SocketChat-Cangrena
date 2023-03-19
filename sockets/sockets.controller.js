const { Socket } = require('socket.io');

const socketController = async( socket = new Socket(), io ) => {
    socket.on('chat message', (msg) => {
        console.log(msg);
        io.emit('chat message', msg);
    });
}

module.exports = {
    socketController
}