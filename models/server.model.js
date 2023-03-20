const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { socketController } = require('../sockets/sockets.controller');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app  = express();
        this.port = process.env.PORT || 3000;
        this.server = createServer( this.app );
        this.io     = require('socket.io')(this.server)

        this.paths = {
            auth:       '/api/auth',
            usuarios:   '/api/usuarios'
        }

        this.connectToDB();

        this.middlewares();

        this.routes();

        this.sockets();
    }

    async connectToDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use( cors() );

        this.app.use( express.json() );

        this.app.use( express.static('public') );
    }

    routes() {
        
    }


    sockets() {
        this.io.on('connection', ( socket ) => socketController(socket, this.io ) )
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;