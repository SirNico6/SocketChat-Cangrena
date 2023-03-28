const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const User = require('../models/user.model');



const usersGet = async(req = request, res = response) => {
    const query = { state: true };

    const [ total, users ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
    ]);

    res.json({
        total,
        users
    });
}

const userPost = async(req, res = response) => {
    
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );
    // Save on BD
    await user.save();

    res.json({
        ok: true,
        user
    });
}

const userPut = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    if ( password ) {
        // Encrypt password
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, rest );
    res.json(user);
}

const userDelete = async(req, res = response) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate( id, { state: false } );
    res.json(user);
}




module.exports = {
    usersGet,
    userPost,
    userPut,
    userDelete,
}