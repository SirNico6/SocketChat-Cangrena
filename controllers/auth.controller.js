const { response } = require('express');
const bcryptjs = require('bcryptjs')
const User = require('../models/user.model');
const { generateJWT } = require('../helpers/generateJWT.helper');

const login = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        // Verificar si el email existe
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                msg: 'User or Password incorrect 1'
            });
        }
        // SI el usuario está activo
        if ( !user.state ) {
            return res.status(400).json({
                msg: 'User deleted'
            });
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, user.password);
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'User or Password incorrect 2'
            });
        }
        // Generar el JWT
        const token = await generateJWT( user.id );
        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'WTF HAPPEND ????'
        });
    }
}

const googleSignin = async(req, res = response) => {
    //TODO
}

const renewToken = async( req, res = response ) =>{
    const { user } = req;
    // Generar el JWT
    const token = await generateJWT( user.id );
    res.json({
        user,
        token
    })
}

module.exports = {
    login,
    googleSignin,
    renewToken
}
