const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://socketchat-cangrena-production.up.railway.app/api/auth/';

let usuario = null;
let socket  = null;

// Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');

// Validar el token del localstorage
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if ( token.length <= 10 ) {
        window.location = 'index.html';
        alert("No hay token che, te logeaste?");
        throw new Error('No hay token en el servidor');
    }
    const resp = await fetch( url, {
        headers: { 'x-token': token }
    }).then(resp => resp.json())
    .then(({ user: userDB, token: tokenDB }) =>{
    localStorage.setItem('token', tokenDB );
    usuario = userDB;
    document.title = usuario.name;
    });


    await conectarSocket();
}

const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () =>{
        console.log('Sockets online')
    });

    socket.on('disconnect', () =>{
        console.log('Sockets offline')
    });

    socket.on('receive-messages', dibujarMensajes );
    socket.on('active-users', dibujarUsuarios );

    socket.on('private-message', ( payload ) => {
        console.log('Privado:', payload )
    });
}

const dibujarUsuarios = ( usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach( ({ name, uid }) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ name } </h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    });
    ulUsuarios.innerHTML = usersHtml;
}

const dibujarMensajes = ( mensajes = []) => {
    let mensajesHTML = '';
    mensajes.forEach( ({ name, message }) => {

        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${ name }: </span>
                    <span>${ message }</span>
                </p>
            </li>
        `;
    });
    ulMensajes.innerHTML = mensajesHTML;
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const message = txtMensaje.value;
    const uid     = txtUid.value;
    if( keyCode !== 13 ){ return; }
    if( message.length === 0 ){ return; }
    socket.emit('send-message', { message, uid });
    txtMensaje.value = '';
    txtUid.value = '';
});

btnSalir.addEventListener('click', ()=> {
    localStorage.removeItem('token');
    window.location = 'index.html';
});

const main = async() => {
    // Validar JWT
    await validarJWT();
}

main();