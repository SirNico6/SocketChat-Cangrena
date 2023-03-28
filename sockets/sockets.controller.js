const { Socket } = require('socket.io');
const { checkToken } = require('../helpers/generateJWT.helper');
const { ChatMessages } = require('../models/chatMessages.model');

const chatMessages = new ChatMessages();

const socketController = async( socket = new Socket(), io ) => {

    const user = await checkToken(socket.handshake.headers['x-token']);
    if ( !user ) {
        return socket.disconnect();
    }

    // Agregar el usuario conectado
    chatMessages.connectUser( user );
    io.emit('active-users', chatMessages.usersArray );
    socket.emit('receive-messages', chatMessages.last10 );

    // Conectarlo a una sala especial
    socket.join( user.id ); // global, socket.id, usuario.id
    
    // Limpiar cuando alguien se desconeta
    socket.on('disconnect', () => {
        chatMessages.disconnectUser( user.id );
        io.emit('active-users', chatMessages.usersArray );
    })

    socket.on('send-message', ({ uid, message }) => {
        if ( uid ) {
            // Mensaje privado
            socket.to( uid ).emit( 'private-message', { de: user.name, message });
        } else {
            chatMessages.sendMessage(user.id, user.name, message );
            io.emit('receive-messages', chatMessages.last10 );
        }

    })

}



module.exports = {
    socketController
}