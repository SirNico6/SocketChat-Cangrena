const { response } = require('express')


const isAdmin = ( req, res = response, next ) => {
    if ( !req.user ) {
        return res.status(500).json({
            msg: 'First has to validate the token'
        });
    }
    const { rol, nombre } = req.user;
    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ nombre } is not an administrator - can't do this`
        });
    }
    next();
}


const hasRole = ( ...roles  ) => {
    return (req, res = response, next) => {
        if ( !req.user ) {
            return res.status(500).json({
                msg: 'First has to validate the token'
            });
        }
        if ( !roles.includes( req.user.role ) ) {
            return res.status(401).json({
                msg: `The service require one of these roles ${ roles }`
            });
        }
        next();
    }
}



module.exports = {
    isAdmin,
    hasRole
}