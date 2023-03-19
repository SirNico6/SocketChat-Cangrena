const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { socketController } = require('../sockets/sockets.controller');

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


        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Sockets
        this.sockets();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
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