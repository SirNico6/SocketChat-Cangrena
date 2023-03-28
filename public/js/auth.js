const register = document.querySelector('#register');
const login    = document.querySelector('#login')

const url = ( window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/'
            : 'https://socketchat-cangrena-production.up.railway.app/api/';

register.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};
    for( let el of register.elements ) {
        if ( el.name.length > 0 ) 
            formData[el.name] = el.value
    }
    fetch( url + 'users', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ ok }) => {
        if( !ok ){
            return console.error( "ERROR FATAAAAl" );
        } else {
            alert("Registro con éxito, ahora inicia sesión");
        }
    })
    .catch( err => {
        console.log(err)
    })
});

login.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};
    console.log("Fijate que entra")
    for( let el of login.elements ) {
        if ( el.name.length > 0 ) 
            formData[el.name] = el.value
    }

    fetch( url + 'auth/login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => {
        if( msg ){
            return console.error( msg );
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch( err => {
        console.log(err)
    })
    
});

function onSignIn(googleUser) {
// TODO
}

function signOut() {
// TODO
}